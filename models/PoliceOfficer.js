const mongoose = require('mongoose');

const policeOfficerSchema = new mongoose.Schema({
    badgeNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rank: { type: String, required: true },
    assignedVehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }] // Vehicles they've seized
});

module.exports = mongoose.model('PoliceOfficer', policeOfficerSchema);
