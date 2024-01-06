const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    licenseNumber: { type: String, required: true, unique: true },
    type: { type: String, required: true }, // e.g., bike, car, truck
    make: { type: String, required: true }, // e.g., Toyota, Honda
    model: { type: String, required: true },
    color: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seizedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'PoliceOfficer' },
    status: { type: String, required: true }, // e.g., seized, released
    location: { // Store real-time location of the towed vehicle
        lat: Number,
        lng: Number,
        timestamp: { type: Date, default: Date.now }
    }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
