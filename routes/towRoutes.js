const express = require("express");
const router = express.Router();
const towController = require("../controllers/towController");

// New endpoints
router.post("/tows", towController.createTow);
router.put("/tows", towController.endTow);
router.get("/tows/history", towController.getTowHistory);
router.post("/tows/add-vehicle", towController.addVehicleToTow);
router.put("/tows/edit-vehicle", towController.editVehicleInTow);
router.delete("/tows/delete-vehicle", towController.deleteVehicleFromTow);

// Older endpoints
router.put("/tows/:id", towController.updateTowById);
router.delete("/tows/vehicleDelete", towController.deleteVehicle);
router.delete("/tows/:id", towController.deleteTowById);
router.get("/tows/:id", towController.getTowById);
router.get("/tows", towController.getAllTows);
router.post("/tows/getlocation", towController.towStatus);

module.exports = router;
