const Tow = require('../models/tow');
const Vehicle = require('../models/Vehicle');
const notifyUsersForTow = require('../utils/generateEmail');
const generateRandomLinkId = require('../utils/generateRandomLInk');
// Create a new tow
const createTow = async (req, res) => {
	try {
		const { policeId, vehicles } = req.body;
		const linkId = generateRandomLinkId();

		if (!policeId || vehicles.length == 0) {
			return res.status(400).json({ message: 'Please fill in all details' });
		}

		// fetch all the users based on the vechicle data provided
		let vehicleId = [];
		let userEmailIds = [];

		for (const licenseNumber of vehicles) {
			// Assuming vehicles is an array of licenseNumber values and you want to find vehicles by licenseNumber
			const vehicle = await Vehicle.findOne({ licenseNumber: licenseNumber }); // Use findOne to get a single document
			if (!vehicle) {
				console.log(`Vehicle with license number ${licenseNumber} not found`);
			} else {
				vehicleId.push(vehicle._id); // Add the vehicle's _id to the vehicleIds array
				userEmailIds.push(vehicle.ownerEmail); // Add the vehicle's ownerEmail to the userEmailIds array
			}
		}

		// Send email to all owners whose car is towed
		const vehicleIdsArray = vehicleId.map((user) => String(user._id));

		const sendEmailToConcernedUsers = await notifyUsersForTow(
			userEmailIds,
			linkId
		);

		const newTow = await Tow.create({
			linkId,
			policeId,
			vehicleId: vehicleIdsArray,
			vehicles,
			startTime : Date.now(),
		});

		console.log(newTow);

		res.status(201).json({ data: newTow, success: true });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTowById = async (req, res) => {
	try {
		const { id } = req.params;
		const { vehicles } = req.body;
		if (!id) {
			return res.status(400).json({ message: 'ID parameter is missing' });
		}

		const updatedTow = await Tow.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		if (!updatedTow) {
			return res.status(404).json({ message: 'Tow not found' });
		}
		// fetch all the users based on the vechicle data provided
		let vehicleId = [];
		let userEmailIds = [];

		for (const vehicleId of vehicles) {
			const vehicle = await Vehicle.find({licenseNumber:vehicleId});
			if (!vehicle) {
				console.log(`Vehicle with ID ${vehicleId} not found`);
			}
			vehicleId.push(vehicle._id);
			userEmailIds.push(vehicle.ownerEmail);
		}

		// Send email to all owners whose car is towed
		const vehicleIdsArray = vehicleId.map((user) => String(user._id));

		const sendEmailToConcernedUsers = await notifyUsersForTow(
			userEmailIds,
			linkId
		);

		const newTow = await Tow.create({
			linkId,
			policeId,
			vehicleId: vehicleIdsArray,
			vehicles,
			startTime,
		});
		res.json(updatedTow);

		res.status(201).json({ data: newTow, success: true });
		
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteTowById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ message: 'ID parameter is missing' });
		}
		const deletedTow = await Tow.findByIdAndDelete(id);
		if (!deletedTow) {
			return res.status(404).json({ message: 'Tow not found' });
		}
		res.status(200).json({
			data: deletedTow,
			success: true,
			message: 'Tow deleted successfully',
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getTowById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ message: 'ID parameter is missing' });
		}
		const tow = await Tow.findById(id);
		if (!tow) {
			return res.status(404).json({ message: 'Tow not found' });
		}
		res.status(200).json({
			data: tow,
			success: true,
			message: 'Tow details fetched successfully!',
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getAllTows = async (req, res) => {
	try {
		const tows = await Tow.find();
		res.status(200).json({
			data: tows,
			success: true,
			message: 'All Tows details fetched successfully!',
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	createTow,
	updateTowById,
	deleteTowById,
	getTowById,
	getAllTows,
};
