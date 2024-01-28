const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	deactivate: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
