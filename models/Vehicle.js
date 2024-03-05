const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
	licenseNumber: {
		type: String,
		required: true,
		unique: true,
	},
	type: {
		type: String,
		required: true,
	},
	make: {
		type: String,
		required: true,
	},
	model: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: true,
	},
	registrationDate: {
		type: Date,
		required: true,
	},
	ownerName: {
		type: String,
		required: true,
	},
	ownerEmail: {
		type: String,
		required: true,
	},
	ownerPhone: {
		type: String,
		required: true,
	},
	locationOfRegistration: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
