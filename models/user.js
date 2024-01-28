const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter a username'],
		trim: true,
	},
	email: {
		type: email,
		required: [true, 'Please enter a email'],
		trim: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide your password'],
		trim: true,
	},
	role: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Role',
		required: false,
	},
	deactivate: {
		type: Boolean,
		required: false,
		default: false,
	},
	phonenumber: {
		type: Number,
		required: false,
		default: false,
	},
});

module.exports = mongoose.model('User', userSchema);
