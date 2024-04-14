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
		required: true,
	},
	users: [
		{
			type: String,
			ref: 'Vehicle',
		},
	],
	vehicles: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Vehicle',
		},
	],
	licenseNumber: [
		{
			type: String,
			ref: 'Vehicle',
		},
	],
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
			vehicle: {
				type: String,
				ref: 'Vehicle',
				required: true
			},
			startTime: {
				type: Date,
				required: true,
				default: Date.now,
			},
			startLocation: {
				lat: {
					type: Number,
					required: true,
				},
				long: {
					type: Number,
					required: true,
				},
			}
		},
	],
	currentLocation: {
		lat: {
			type: Number,
			required: true,
		},
		long: {
			type: Number,
			required: true,
		},
	},
	updatedTime: {
		type: Date,
		required: true,
		default: Date.now,
	},
	endLocation: {
		lat: {
			type: Number,
			required: true,
		},
		long: {
			type: Number,
			required: true,
		},
	},
	sessionEnd: {
		type: Boolean,
		required: true,
	}
});

const Tow = mongoose.model('Tow', towSchema);

module.exports = Tow;
