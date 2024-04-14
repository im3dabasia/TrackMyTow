const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Role = require("../models/role");

// Will be used in registering police officer only
const signUp = async (req, res) => {
  try {
    const { name, email, password, role, phonenumber } = req.body;

    console.log(req.body);
    if (!name || !email || !password || !role || !phonenumber) {
      return res.status(400).json({
        success: false,
        message: "Please specify all the fields",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phonenumber }],
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with the provided email or phone number already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phonenumber,
    });
    console.log(newUser);

    const userdetail = await User.findById(newUser._id)
      .populate({ path: "role" })
      .select("-password -deactivate");
    // .populate({ path: 'role', select: '-deactivate' })

    const userRole = await Role.findOne({ _id: role });
    const token = generateToken(
      newUser._id,
      newUser.email,
      userRole.name,
      newUser.phonenumber
    );

    return res
      .cookie("token", token, {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(200)
      .json({
        success: true,
        message: "Registration successful",
        data: {
          token,
          userdetail,
        },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, phonenumber, password } = req.body;
    console.log(req.body);

    if ((!email || !phonenumber) && !password) {
      return res.status(400).json({
        success: false,
        message: "Please specify all the fields",
      });
    }

    let query = {};
    if (email) query.email = email;
    if (phonenumber) query.phonenumber = phonenumber;

    const user = await User.findOne({
      $or: [query],
    })
      .populate({ path: "role", select: "-deactivate" })
      .select("-deactivate");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }
    console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log(isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    delete user._doc.password;
    const userRole = await Role.findById(user.role);
    const token = generateToken(
      user._id,
      user.email,
      userRole.name,
      user.phonenumber
    );

    return res
      .cookie("token", token, {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user,
        },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login user",
      error: error.message,
    });
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .populate({
        path: "role",
        select: "-deactivate",
      })
      .select("-deactivate -password");
    return res.status(200).json({ success: true, data: "users" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .populate({
        path: "role",
        select: "-deactivate",
      })
      .select("-deactivate -password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "Update successful",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndUpdate(
      id,
      {
        deactivate: true,
      },
      {
        new: true,
      }
    )
      .populate({
        path: "role",
        select: "-deactivate",
      })
      .select("-password ");
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "Deactivation successful",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

const logout = async (req, res, next) => {
  try {
    return res.clearCookie("token").status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  signUp,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  login,
  logout,
};
