const checkRole = (roles) => (req, res, next) => {
	// console.log(req.user);
	if (req.user && req.user.userId && req.user.role) {
		const userRole = req.user.role;

		if (roles.includes(userRole)) {
			return next();
		}
	}

	return res.status(401).json({ Message: 'Access denied' });
};

module.exports = checkRole;
