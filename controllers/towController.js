const Tow = require('../models/tow');
const Vehicle = require('../models/Vehicle');
const notifyUsersForTow = require('../utils/generateEmail');
const generateRandomLinkId = require('../utils/generateRandomLInk');
// Create a new tow
const createTow = async (req, res) => {
	try {
		const { policeId, vehicles, startTime } = req.body;
		const linkId = generateRandomLinkId();

		if (!policeId || vehicles.length == 0 || !startTime) {
			return res.status(400).json({ message: 'Please fill in all details' });
		}

		// fetch all the users based on the vechicle data provided
		let userIds = [];
		let userEmailIds = [];

		for (const vehicleId of vehicles) {
			const vehicle = await Vehicle.findById(vehicleId);
			if (!vehicle) {
				console.log(`Vehicle with ID ${vehicleId} not found`);
			}
			userIds.push(vehicle.owner);
			userEmailIds.push(vehicle.ownerEmail);
		}

		// Send email to all owners whose car is towed
		const userIdsArray = userIds.map((user) => String(user._id));

		const sendEmailToConcernedUsers = await notifyUsersForTow(
			userEmailIds,
			linkId
		);

		const newTow = await Tow.create({
			linkId,
			policeId,
			userIds: userIdsArray,
			vehicles,
			startTime,
		});

		res.status(201).json({ data: newTow, success: true });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTowById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ message: 'ID parameter is missing' });
		}
		const updatedTow = await Tow.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (!updatedTow) {
			return res.status(404).json({ message: 'Tow not found' });
		}
		res.json(updatedTow);
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
