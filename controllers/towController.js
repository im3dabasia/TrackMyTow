const { Tow, TowSession } = require("../models/tow");
const Vehicle = require("../models/Vehicle");
const notifyUsersForTow = require("../utils/generateEmail");
const generateRandomLinkId = require("../utils/generateRandomLInk");

const createTow = async (req, res) => {
  console.log(req.body);
  try {
    const { policeId, startLocation, endLocation } = req.body;
    const linkId = generateRandomLinkId();

    if (!policeId || !startLocation || !endLocation) {
      return res.status(400).json({
        message: "Please specify all the fields",
        success: false,
      });
    }

    const newTow = await TowSession.create({
      linkId,
      policeId,
      towedVehicles: [],
      startLocation,
      currentLocation: startLocation,
      endLocation,
      startTime: new Date(),
      sessionEnd: false,
    });

    console.log(newTow);

    return res.status(200).json({
      data: newTow,
      success: true,
      message: "Create tow session successful",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const endTow = async (req, res) => {
  console.log(req.body);
  try {
    const { towId } = req.body;

    if (!towId) {
      return res
        .status(400)
        .json({ message: "Please specify tow ID", success: false });
    }

    const currentTow = await TowSession.findById(towId);

    if (currentTow) {
      if (currentTow.sessionEnd) {
        return res.status(404).json({
          message: "Tow session already ended",
          success: false,
        });
      }

      currentTow.endLocation = currentTow.currentLocation;
      currentTow.sessionEnd = true;

      await currentTow.save();

      console.log(currentTow);

      return res.status(200).json({
        data: currentTow,
        success: true,
        message: "End tow session successful",
      });
    } else {
      return res.status(404).json({
        message: "No tow session found",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const updateTowLocation = async (req, res) => {
  console.log(req.body);
  try {
    const { towId, currentLocation } = req.body;

    if (!towId || !currentLocation) {
      return res
        .status(400)
        .json({ message: "Please specify all fields", success: false });
    }

    const currentTow = await TowSession.findById(towId);

    if (currentTow) {
      if (currentTow.sessionEnd) {
        return res.status(404).json({
          message: "Tow session already ended",
          success: false,
        });
      }

      currentTow.currentLocation = currentLocation;

      await currentTow.save();

      console.log(currentTow);

      return res.status(200).json({
        data: currentTow,
        success: true,
        message: "Update current tow location successful",
      });
    } else {
      return res.status(404).json({
        message: "No tow session found",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const addVehicleToTow = async (req, res) => {
  console.log(req.body);
  try {
    const { towId, numberPlate, pickupLocation } = req.body;
    let userEmailId;
    const linkId = generateRandomLinkId();

    if (!towId || !numberPlate || !pickupLocation) {
      return res.status(400).json({
        message: "Please specify all the fields",
        success: false,
      });
    }

    const currentTow = await TowSession.findById(towId);

    if (currentTow) {
      if (currentTow.sessionEnd) {
        return res.status(404).json({
          message: "Cannot add vehicle to inactive tow session",
          success: false,
        });
      }

      const existingVehicle = currentTow.towedVehicles.find(
        (vehicle) => vehicle.numberPlate === numberPlate
      );

      if (existingVehicle) {
        return res.status(400).json({
          message: "Vehicle already exists in the current session",
          success: false,
        });
      }

      const newVehicle = {
        numberPlate,
        pickupLocation,
        startTime: new Date(),
      };

      console.log(newVehicle);

      currentTow.towedVehicles.push(newVehicle);

      currentTow.lastLocationUpdateTime = Date.now();

      await currentTow.save();

      console.log("current Tow", currentTow);

      const vehicle = await Vehicle.findOne({
        licenseNumber: numberPlate,
      }); // Use findOne to get a single document
      if (!vehicle) {
        console.log(`Vehicle with license number ${numberPlate} not found`);
      }
      userEmailId = vehicle.ownerEmail;
      usernumberPlate = vehicle.licenseNumber;
      userName = vehicle.ownerName;

      // send email to owner of vehicle that their vehicle has been picked up by a tow truck driver
      await notifyUsersForTow(
        userEmailId,
        linkId,
        userName,
        usernumberPlate,
        "35621090"
      );
      console.log(`Email sent successfully to ${userEmailId}.`);

      return res.status(200).json({
        data: currentTow,
        success: true,
        message: "Add vehicle to tow successful",
      });
    } else {
      return res.status(404).json({
        message: "No tow session found",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const editVehicleInTow = async (req, res) => {
  console.log(req.body);
  try {
    const { towId, oldNumberPlate, newNumberPlate, newPickupLocation } =
      req.body;

    if (!towId || !oldNumberPlate || !newNumberPlate || !newPickupLocation) {
      return res.status(400).json({
        message: "Please specify all the fields",
        success: false,
      });
    }

    const currentTow = await TowSession.findById(towId);

    if (currentTow) {
      if (currentTow.sessionEnd) {
        return res.status(404).json({
          message: "Cannot edit vehicle in inactive tow session",
          success: false,
        });
      }

      const existingVehicleIndex = currentTow.towedVehicles.findIndex(
        (vehicle) => vehicle.numberPlate === oldNumberPlate
      );

      if (existingVehicleIndex === -1) {
        return res.status(404).json({
          message: "Vehicle does not exist in the current session",
          success: false,
        });
      }

      currentTow.towedVehicles[existingVehicleIndex].numberPlate =
        newNumberPlate;
      currentTow.towedVehicles[existingVehicleIndex].pickupLocation =
        newPickupLocation;

      await currentTow.save();

      console.log(currentTow);

      return res.status(200).json({
        data: currentTow,
        success: true,
        message: "Edit vehicle in tow successful",
      });
    } else {
      return res.status(404).json({
        message: "No tow session found",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const deleteVehicleFromTow = async (req, res) => {
  console.log(req.body);
  try {
    const { towId, numberPlate } = req.body;

    if (!towId || !numberPlate) {
      return res.status(400).json({
        message: "Please specify all the fields",
        success: false,
      });
    }

    const currentTow = await TowSession.findById(towId);

    if (currentTow) {
      if (currentTow.sessionEnd) {
        return res.status(404).json({
          message: "Cannot delete vehicle from inactive tow session",
          success: false,
        });
      }

      const existingVehicleIndex = currentTow.towedVehicles.findIndex(
        (vehicle) => vehicle.numberPlate === numberPlate
      );

      if (existingVehicleIndex === -1) {
        return res.status(404).json({
          message: "Vehicle does not exist in the current session",
          success: false,
        });
      }

      currentTow.towedVehicles = currentTow.towedVehicles.filter(
        (vehicle) => vehicle.numberPlate !== numberPlate
      );

      await currentTow.save();

      console.log(currentTow);

      return res.status(200).json({
        data: currentTow,
        success: true,
        message: "Delete vehicle from tow successful",
      });
    } else {
      return res.status(404).json({
        message: "No tow session found",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getTowHistory = async (req, res) => {
  console.log(req.body);
  try {
    const { policeId } = req.body;

    if (!policeId) {
      return res
        .status(400)
        .json({ message: "Please specify police ID", success: false });
    }

    const prevTows = await TowSession.find({
      policeId,
      sessionEnd: true,
      sessionEnd: true,
    });

    if (prevTows.length != 0) {
      return res.status(200).json({
        data: prevTows,
        success: true,
        message: "Tow history retrieval successful",
      });
    } else {
      return res.status(404).json({
        message: "No tow history available",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const towStatus = async (req, res) => {
  console.log(req.body);
  try {
    const { vehicles } = req.body;

    const latestTow = await TowSession.findOne({
      "towedVehicles.numberPlate": vehicles,
    })
      .sort({ lastLocationUpdateTime: -1 })
      .limit(1);

    console.log(latestTow);

    if (!latestTow) {
      return res.status(500).json({
        message: "Tow data not found for the provided vehicle ID",
      });
    }

    let currLocation;
    if (latestTow.sessionEnd === false) {
      // If session is ongoing, get the current location from the latest tow data
      currLocation = {
        latitude: latestTow.currentLocation.lat,
        longitude: latestTow.currentLocation.long,
      };
    } else {
      // If session is ended, get the location from the last ended session
      const lastEndedSession = await TowSession.findOne({
        "towedVehicles.numberPlate": vehicles,
      })
        .sort({ lastLocationUpdateTime: -1 })
        .limit(1);
      if (!lastEndedSession) {
        return res.status(500).json({
          message: "No ended session found for the provided vehicle ID",
          success: false,
        });
      }
      currLocation = {
        latitude: lastEndedSession.endLocation.lat,
        longitude: lastEndedSession.endLocation.long,
      };
    }

    console.log(
      `Current location of vehicle with ID ${vehicles}:`,
      currLocation
    );

    // You can now post the current location or use it as needed in your application
    res.status(200).json({
      location: currLocation,
      startLocation: latestTow.startLocation,
      endLocation: latestTow.endLocation,
      success: true,
      message: "Location Sent Successfully",
    });
    // return currentLocation;
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// const createTow2 = async (req, res) => {
//   console.log(req.body);
//   try {
//     const {
//       policeId,
//       vehicles,
//       journey,
//       endLocation,
//       currentLocation,
//       sessionEnd,
//     } = req.body;
//     const linkId = generateRandomLinkId();

//     if (!policeId || vehicles.length == 0) {
//       return res
//         .status(500)
//         .json({ message: "Please specify all the fields", success: false });
//     }

//     // fetch all the users based on the vechicle data provided
//     let vehicleId = [];
//     let userEmailIds = [];
//     let userNamesArray = [];
//     let license = [];
//     let updatedJourney = [];

//     for (const licenseNumber of vehicles) {
//       // Assuming vehicles is an array of licenseNumber values and you want to find vehicles by licenseNumber
//       const vehicle = await Vehicle.findOne({ licenseNumber: licenseNumber }); // Use findOne to get a single document
//       if (!vehicle) {
//         console.log(`Vehicle with license number ${licenseNumber} not found`);
//       } else {
//         vehicleId.push(vehicle._id); // Add the vehicle's _id to the vehicleIds array
//         userEmailIds.push(vehicle.ownerEmail); // Add the vehicle's ownerEmail to the userEmailIds array
//         userNamesArray.push(vehicle.ownerName);
//         license.push(vehicle.licenseNumber);

//         const vehicleLocation = journey[vehicleId.length - 1];
//         console.log(vehicleLocation);
//         if (!vehicleLocation || !vehicleLocation.lat || !vehicleLocation.long) {
//           return res.status(500).json({
//             message: `Invalid location data for vehicle ${licenseNumber}`,
//             success: false,
//           });
//         }

//         // Update the vehicle's location in the database
//         await Vehicle.updateOne(
//           { _id: vehicle._id },
//           { $set: { location: vehicleLocation } }
//         );
//         console.log(
//           `Location of vehicle with license number ${licenseNumber} updated to ${vehicleLocation}`
//         );

//         updatedJourney.push({
//           vehicle: licenseNumber,
//           lat: vehicleLocation.lat,
//           long: vehicleLocation.long,
//           startLocation: {
//             lat: vehicleLocation.startLocation.lat,
//             long: vehicleLocation.startLocation.long,
//           },
//         });
//       }
//     }

//     // Send email to all owners whose car is towed
//     const vehicleIdsArray = vehicleId.map((user) => String(user._id));

//     const sendEmailToConcernedUsers = await notifyUsersForTow(
//       userEmailIds,
//       linkId
//     );

//     const newTow = await Tow.create({
//       linkId,
//       policeId,
//       users: userNamesArray,
//       vehicles: vehicleIdsArray,
//       licenseNumber: license,
//       startTime: Date.now(),
//       journey: updatedJourney,
//       endLocation,
//       currentLocation,
//       sessionEnd,
//     });

//     console.log(newTow);

//     res.status(200).json({ data: newTow, success: true });
//   } catch (error) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// };
// 	const vehicleLocation = journey.find(location => location.vehicle === licenseNumber);
// 	console.log(vehicleLocation);
//     if (!vehicleLocation || !vehicleLocation.lat || !vehicleLocation.long) {
//         return res.status(500).json({ message: `Invalid location data for vehicle ${licenseNumber}` });
//     }
//     // Update the vehicle's location in the database
//     await Vehicle.updateOne({ _id: vehicle._id }, { $set: { location: vehicleLocation } });
//     console.log(`Location of vehicle with license number ${licenseNumber} updated to ${vehicleLocation}`);

// 	journey.push({ lat: vehicleLocation.latitude, long: vehicleLocation.longitude });
// }

//primary code
// const updateTowById = async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		const { vehicles } = req.body;
// 		if (!id) {
// 			return res.status(500).json({ message: 'ID parameter is missing' });
// 		}

// 		const updatedTow = await Tow.findByIdAndUpdate(id, req.body, {
// 			new: true,
// 		});

// 		if (!updatedTow) {
// 			return res.status(404).json({ message: 'Tow not found' });
// 		}
// 		// fetch all the users based on the vechicle data provided
// 		let vehicleId = [];
// 		let userEmailIds = [];

// 		for (const vehicleId of vehicles) {
// 			const vehicle = await Vehicle.find({ licenseNumber: vehicleId });
// 			if (!vehicle) {
// 				console.log(`Vehicle with ID ${vehicleId} not found`);
// 			}
// 			vehicleId.push(vehicle._id);
// 			userEmailIds.push(vehicle.ownerEmail);
// 		}

// 		// Send email to all owners whose car is towed
// 		const vehicleIdsArray = vehicleId.map((user) => String(user._id));

// 		const sendEmailToConcernedUsers = await notifyUsersForTow(
// 			userEmailIds,
// 			linkId
// 		);

// 		const newTow = await Tow.create({
// 			linkId,
// 			policeId,
// 			vehicleId: vehicleIdsArray,
// 			vehicles,
// 			startTime,
// 		});
// 		res.json(updatedTow);

// 		res.status(201).json({ data: newTow, success: true });

// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// };

//secondary code - other code
// const updateTowById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { vehicles, desiredLocations } = req.body;

//         if (!id) {
//             return res.status(500).json({ message: 'ID parameter is missing' });
//         }

//         if (!vehicles || vehicles.length === 0 || !desiredLocations || desiredLocations.length === 0) {
//             return res.status(500).json({ message: 'Invalid input data' });
//         }

//         // Check if the Tow exists
//         const currentTow = await Tow.findById(id);
//         if (!currentTow) {
//             return res.status(404).json({ message: 'Tow not found' });
//         }

//         // Initialize an object to store whether each vehicle has reached the desired location
//         const vehicleReachedDesiredLocation = {};
//         vehicles.forEach(vehicleId => {
//             vehicleReachedDesiredLocation[vehicleId] = false;
//         });

//         // Continuously update the location until all vehicles reach the desired location
//         while (!Object.values(vehicleReachedDesiredLocation).every(reached => reached)) {
//             for (const vehicleId of vehicles) {
//                 const vehicle = await Vehicle.findById(vehicleId);
//                 if (!vehicle) {
//                     console.log(`Vehicle with ID ${vehicleId} not found`);
//                     continue;
//                 }

//                 const desiredLocation = desiredLocations.find(location => location.vehicleId === vehicleId);
//                 if (!desiredLocation) {
//                     console.log(`Desired location not found for vehicle with ID ${vehicleId}`);
//                     continue;
//                 }

//                 // Simulate updating the location (replace with actual logic to fetch location from frontend)
//                 const newLocation = generateRandomLocation(); // Function to generate random location
//                 vehicle.location = newLocation;
//                 await vehicle.save();

//                 console.log(`Location of vehicle with ID ${vehicleId} updated to ${newLocation}`);

//                 // Check if the vehicle has reached the desired location
//                 const distanceToDesiredLocation = calculateDistance(vehicle.location, desiredLocation.location);
//                 if (distanceToDesiredLocation < 0.1) { // Adjust this threshold based on your requirement
//                     vehicleReachedDesiredLocation[vehicleId] = true;
//                 }
//             }

//             // Simulate updating every 2 seconds
//             await new Promise(resolve => setTimeout(resolve, 2000));
//         }

//         res.status(200).json({ message: 'Location update completed' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// const updateTowById = async (req, res) => {
//     try {
//         // Find the existing tow document with the provided ID and update its fields
//         const updatedTow = await Tow.findOneAndUpdate(
//             { _id: req.params.id },
//             {
//                 $addToSet: { users: { $each: req.body.users } },
//                 $addToSet: { vehicles: { $each: req.body.vehicles } },
//                 $addToSet: { licenseNumber: { $each: req.body.licenseNumber } },
//                 $addToSet: { journey: { $each: req.body.journey } }
//             },
//             { new: true }

//         );
// 		console.log(updatedTow)

//         // Return success response with the updated tow document
//         res.status(200).json({ data: updatedTow, success: true });
//     } catch (error) {
//         // Return error response
//         res.status(500).json({ error: error.message, success: false });
//     }
// };

// const updateTowById = async (req, res) => {
//   try {
//     const { vehicles, journey } = req.body;

//     // Array to store vehicle details
//     let vehicleId = [];
//     let userEmailIds = [];
//     let userNamesArray = [];
//     let license = [];
//     let updatedVehicles = [];

//     // Iterate through license numbers to fetch vehicle details
//     for (const licenseNumber of vehicles) {
//       const vehicle = await Vehicle.findOne({ licenseNumber: licenseNumber });
//       if (!vehicle) {
//         return res.status(500).json({
//           message: `Vehicle with license number ${licenseNumber} not found`,
//           success: false,
//         });
//       }

//       console.log("Vehicle: ", vehicle);
//       vehicleId.push(vehicle._id); // Add the vehicle's _id to the vehicleIds array
//       userEmailIds.push(vehicle.ownerEmail); // Add the vehicle's ownerEmail to the userEmailIds array
//       userNamesArray.push(vehicle.ownerName);
//       license.push(vehicle.licenseNumber);
//       updatedVehicles.push(vehicle);
//     }

//     // Update Tow document with fetched vehicle details
//     const updatedTow = await Tow.findOneAndUpdate(
//       { _id: req.params.id },
//       {
//         $push: {
//           users: { $each: userNamesArray },
//           vehicles: { $each: vehicleId },
//           licenseNumber: { $each: license },
//           // journey: { $each: journey },
//           journey: {
//             $each: journey.map((journeyData, index) => ({
//               ...journeyData,
//               vehicle: vehicles[index], // Matching each journey with its corresponding vehicle
//             })),
//           },
//         },
//       },
//       { new: true }
//     );

//     console.log("Updated Tow: ", updatedTow);

//     // Return success response with the updated Tow document
//     res.status(200).json({ data: updatedTow, success: true });
//   } catch (error) {
//     // Return error response
//     res.status(500).json({ error: error.message, success: false });
//   }
// };

// const deleteTowById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res
//         .status(500)
//         .json({ message: "ID parameter is missing", success: false });
//     }
//     const deletedTow = await Tow.findByIdAndDelete(id);
//     if (!deletedTow) {
//       return res
//         .status(404)
//         .json({ message: "Tow session not found", success: false });
//     }
//     res.status(200).json({
//       data: deletedTow,
//       success: true,
//       message: "Delete tow session successful",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// };

// const getTowById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res
//         .status(500)
//         .json({ message: "ID parameter is missing", success: false });
//     }
//     const tow = await Tow.findById(id);
//     if (!tow) {
//       return res
//         .status(404)
//         .json({ message: "Tow session not found", success: false });
//     }
//     res.status(200).json({
//       data: tow,
//       success: true,
//       message: "Fetch tow details successful",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// };

// const getAllTows = async (req, res) => {
//   try {
//     const tows = await Tow.find();
//     res.status(200).json({
//       data: tows,
//       success: true,
//       message: "Fetch all tow details successful",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// };

// const deleteVehicle = async (req, res) => {
//   try {
//     const { vehicles } = req.body; // The license number of the vehicle to be removed

//     // Find the Tow document that contains the vehicle with the specified license number
//     const tow = await Tow.findOne({ licenseNumber: { $in: vehicles } });

//     if (!tow) {
//       console.log("No tow found containing the specified vehicle.");
//       return res.status(404).json({
//         message: "No tow found containing the specified vehicle.",
//         success: false,
//       });
//     }

//     console.log("Tow document found:", tow);

//     if (tow.sessionEnd === false) {
//       // Find the index of the vehicle to be removed
//       const vehicleIndex = tow.licenseNumber.findIndex(
//         (license) => license === vehicles
//       );

//       if (vehicleIndex === -1) {
//         console.log("Vehicle not found in the Tow document.");
//         return res.status(404).json({
//           message: "Vehicle not found in the Tow document.",
//           success: false,
//         });
//       }

//       // Delete the corresponding index from vehicles array
//       tow.vehicles.splice(vehicleIndex, 1);

//       // Delete the corresponding index from licenseNumber array
//       tow.licenseNumber.splice(vehicleIndex, 1);

//       // Delete the corresponding index from users array (if exists)
//       if (tow.users && tow.users.length > vehicleIndex) {
//         tow.users.splice(vehicleIndex, 1);
//       }

//       // Delete the corresponding index from journey array (if exists)
//       if (tow.journey && tow.journey.length > vehicleIndex) {
//         tow.journey.splice(vehicleIndex, 1);
//       }

//       // Validate policeId before saving
//       if (!mongoose.Types.ObjectId.isValid(tow.policeId)) {
//         console.log("Invalid or missing policeId.");
//         return res
//           .status(400)
//           .json({ message: "Invalid or missing policeId.", success: false });
//       }

//       console.log("Tow after Updation: ", tow);
//       console.log("policeId before saving:", tow.policeId);
//       // Save the updated Tow document in the database
//       await tow.save();

//       console.log("Vehicle data successfully deleted.");
//       return res.status(200).json({
//         data: tow,
//         success: true,
//         message: "Vehicle data successfully deleted.",
//       });
//     } else {
//       console.log(`No Live Session found of ${vehicles}`);
//       return res.status(500).json({
//         message: `No Live Session found of ${vehicles}`,
//         success: false,
//       });
//     }
//   } catch (error) {
//     console.error("Error deleting vehicle data:", error);
//     return res
//       .status(500)
//       .json({ message: "Error deleting vehicle data", success: false });
//   }
// };

module.exports = {
  createTow,
  endTow,
  updateTowLocation,
  getTowHistory,
  addVehicleToTow,
  editVehicleInTow,
  deleteVehicleFromTow,
  towStatus,
};
