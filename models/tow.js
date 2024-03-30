const mongoose = require('mongoose');

const towSchema = new mongoose.Schema({
	linkId: {
		type: String,
		required: true,
		unique: true,
	},
	policeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: false,
		default: false,
	},
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Vehicle',
		},
	],
	vechicles: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Vehicle',
		},
	],
	startTime: {
		type: Date,
		required: true,
		default: Date.now,
	},
	endTime: {
		type: Date,
		required: true,
		default: Date.now,
	},
	journey: [
		{
			lat: {
				type: Number,
				required: true,
			},
			long: {
				type: Number,
				required: true,
			},
		},
	],
});

const Tow = mongoose.model('Tow', towSchema);

module.exports = Tow;
