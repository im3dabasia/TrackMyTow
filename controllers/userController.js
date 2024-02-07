const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

//User registration
exports.register = async (req, res) => {
    try {
        const usernameCheck = await User.findOne({ username: req.body.username });
        if (usernameCheck){
            console.log(usernameCheck);
            return res.json({ message: "Username already used", status: false });
        }
        const emailCheck = await User.findOne({ email: req.body.email });
        if (emailCheck){
            return res.json({ message: "Email already used", status: false });
        }    

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            // vehicle: req.body.vehicle || []
            // profilePicture: req.body.picture,
            // location: req.body.location,
            // subscription: req.body.subscription || false
        });

        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

//User login
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(400).json({message: "User Not Found!"});
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            return res.status(400).json({message: "Invalid password!"});
        }

        //Generate token
        const token = jwt.sign({_id: user._id}, secretKey, {expiresIn: "12h"});
        res.header("Auth-Token", token).json({token, _id: user._id, email: user.email, username: user.username});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}