const express = require("express");
const router = express.Router();
const towController = require("../controllers/towController");

// Middlewares
const verifyToken = require("../middlewares/tokenAuth");
const checkRole = require("../middlewares/checkRole");

// New endpoints
router.post(
  "/tows",
  verifyToken,
  checkRole(["Police", "Admin"]),
  towController.createTow
);
router.put(
  "/tows",
  verifyToken,
  checkRole(["Police", "Admin"]),
  towController.endTow
);
router.get(
  "/tows/history",
  verifyToken,
  checkRole(["Police", "Admin"]),
  towController.getTowHistory
);
router.put(
  "/tows/update-current-location",
  verifyToken,
  checkRole(["Police", "Admin"]),
  towController.updateTowLocation
);
router.post(
  "/tows/add-vehicle",
  verifyToken,
  checkRole(["Police", "Admin"]),
  towController.addVehicleToTow
);
router.put(
  "/tows/edit-vehicle",
  verifyToken,
  checkRole(["Police", "Admin"]),
  towController.editVehicleInTow
);
router.delete(
  "/tows/delete-vehicle",
  verifyToken,
  checkRole(["Police", "Admin"]),
  towController.deleteVehicleFromTow
);

// Older endpoints
// router.put("/tows/:id", towController.updateTowById);
// router.delete("/tows/vehicleDelete", towController.deleteVehicle);
// router.delete("/tows/:id", towController.deleteTowById);
// router.get("/tows/:id", towController.getTowById);
// router.get("/tows", towController.getAllTows);
router.post("/tows/getlocation", towController.towStatus);

module.exports = router;
