const express = require('express');
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

router.post("/vehicles", vehicleController.vehicles);
// router.post("/login", userController.login);

module.exports = router;