const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
	try {
		const token = req.cookies ? req.cookies.token : '';

		if (!token) {
			return res.status(401).json({ error: 'User not authorized' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: 'User not authorized' });
		}

		req.user = {
			userId: decoded.id,
			role: decoded.role,
			userEmail: decoded.email,
			userPhonenumber: decoded.phonenumber,
		};

		next();
	} catch (error) {
		next(error);
	}
};

module.exports = verifyToken;
