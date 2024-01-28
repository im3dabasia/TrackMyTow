const mongoose = require('mongoose');

const isValidMongoObjectId = (req, res, next) => {
	if (req.params.id) {
		const { id } = req.params;
		if (mongoose.Types.ObjectId.isValid(id)) {
			next();
		} else {
			return res.status(200).json({ message: 'Id not found', success: false });
		}
	}
};

function isValidMongoObjectIdManual(id) {
	return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
	isValidMongoObjectId,
	isValidMongoObjectIdManual,
};
