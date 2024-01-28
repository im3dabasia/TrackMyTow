const errorHandeler = (error, req, res, next) => {
	console.log('errorHandeler');
	return res.status(500).json({
		success: false,
		message: 'Failed to update user',
		error: error.message,
	});
};

module.exports = errorHandeler;
