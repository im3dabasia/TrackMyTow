const Vehicle = require('../models/Vehicle');

// Create a new vehicle
const createVehicle = async (req, res) => {
	try {
		const newVehicle = await Vehicle.create(req.body);
		res.status(200).json(newVehicle);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update a vehicle by ID
const updateVehicleById = async (req, res) => {
	try {
		const updatedVehicle = await Vehicle.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!updatedVehicle) {
			return res.status(404).json({ message: 'Vehicle not found' });
		}
		res.json(updatedVehicle);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete a vehicle by ID
const deleteVehicleById = async (req, res) => {
	try {
		const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
		if (!deletedVehicle) {
			return res.status(404).json({ message: 'Vehicle not found' });
		}
		res.json({ message: 'Delete vehicle successful' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get a vehicle by ID
const getVehicleById = async (req, res) => {
	try {
		const vehicle = await Vehicle.findById(req.params.id);
		if (!vehicle) {
			return res.status(404).json({ message: 'Vehicle not found' });
		}
		res.json(vehicle);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get all vehicles
const getAllVehicles = async (req, res) => {
	try {
		const vehicles = await Vehicle.find();
		res.status(200).json(vehicles);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createVehicle,
	updateVehicleById,
	deleteVehicleById,
	getVehicleById,
	getAllVehicles,
};
