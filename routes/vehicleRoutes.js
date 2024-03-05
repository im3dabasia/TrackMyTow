const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.post('/vehicles', vehicleController.createVehicle);

router.put('/vehicles/:id', vehicleController.updateVehicleById);

router.delete('/vehicles/:id', vehicleController.deleteVehicleById);

router.get('/vehicles/:id', vehicleController.getVehicleById);

router.get('/vehicles', vehicleController.getAllVehicles);

module.exports = router;
