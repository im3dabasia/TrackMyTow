const Tow = require('../models/tow');
const Vehicle = require('../models/Vehicle');
const notifyUsersForTow = require('../utils/generateEmail');
const generateRandomLinkId = require('../utils/generateRandomLInk');
// Create a new tow
const createTow = async (req, res) => {
	console.log(req.body);
	try {
		const { policeId, vehicles, journey, endLocation, currentLocation } = req.body;
		const linkId = generateRandomLinkId();

		if (!policeId || vehicles.length == 0) {
			return res.status(500).json({ message: 'Please specify all the fields' });
		}

		// fetch all the users based on the vechicle data provided
		let vehicleId = [];
		let userEmailIds = [];
		let userNamesArray = [];
		let license = [];
		let updatedJourney = [];

		for (const licenseNumber of vehicles) {
			// Assuming vehicles is an array of licenseNumber values and you want to find vehicles by licenseNumber
			const vehicle = await Vehicle.findOne({ licenseNumber: licenseNumber }); // Use findOne to get a single document
			if (!vehicle) {
				console.log(`Vehicle with license number ${licenseNumber} not found`);
			} else {
				vehicleId.push(vehicle._id); // Add the vehicle's _id to the vehicleIds array
				userEmailIds.push(vehicle.ownerEmail); // Add the vehicle's ownerEmail to the userEmailIds array
				userNamesArray.push(vehicle.ownerName);
				license.push(vehicle.licenseNumber);

				const vehicleLocation = journey[vehicleId.length - 1];
                console.log(vehicleLocation);
                if (!vehicleLocation || !vehicleLocation.lat || !vehicleLocation.long) {
					return res.status(500).json({ message: `Invalid location data for vehicle ${licenseNumber}` });
                }
				
                // Update the vehicle's location in the database
                await Vehicle.updateOne({ _id: vehicle._id }, { $set: { location: vehicleLocation } });
                console.log(`Location of vehicle with license number ${licenseNumber} updated to ${vehicleLocation}`);
				
                updatedJourney.push({ vehicle: licenseNumber, lat: vehicleLocation.lat, long: vehicleLocation.long, startLocation: {
					lat: vehicleLocation.startLocation.lat,
					long: vehicleLocation.startLocation.long
				}, });
            }
		}
		
		// Send email to all owners whose car is towed
		const vehicleIdsArray = vehicleId.map((user) => String(user._id));
		
		
		const sendEmailToConcernedUsers = await notifyUsersForTow(
			userEmailIds,
			linkId
			);
			
			const newTow = await Tow.create({
				linkId,
				policeId,
				users: userNamesArray,
				vehicles: vehicleIdsArray,
				licenseNumber: license,
				startTime: Date.now(),
				journey: updatedJourney,
				endLocation,
				currentLocation
			});
			
			console.log(newTow);
			
			res.status(200).json({ data: newTow, success: true });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};
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
//         const existingTow = await Tow.findById(id);
//         if (!existingTow) {
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

const updateTowById = async (req, res) => {
    try {
        const {vehicles, journey} = req.body;

        // Array to store vehicle details
		let vehicleId = [];
		let userEmailIds = [];
		let userNamesArray = [];
		let license = [];
        let updatedVehicles = [];

        // Iterate through license numbers to fetch vehicle details
        for (const licenseNumber of vehicles) {
            const vehicle = await Vehicle.findOne({ licenseNumber: licenseNumber });
            if (!vehicle) {
                return res.status(500).json({ message: `Vehicle with license number ${licenseNumber} not found` });
            }

			console.log("Vehicle: ", vehicle);
			vehicleId.push(vehicle._id); // Add the vehicle's _id to the vehicleIds array
			userEmailIds.push(vehicle.ownerEmail); // Add the vehicle's ownerEmail to the userEmailIds array
			userNamesArray.push(vehicle.ownerName);
			license.push(vehicle.licenseNumber);
            updatedVehicles.push(vehicle);
        }

        // Update Tow document with fetched vehicle details
        const updatedTow = await Tow.findOneAndUpdate(
            { _id: req.params.id },
            {
				 $push: {
					users: { $each: userNamesArray },
					vehicles: { $each: vehicleId },
					licenseNumber: { $each: license },
					// journey: { $each: journey },
					journey: {
						$each: journey.map((journeyData, index) => ({
							...journeyData,
							vehicle: vehicles[index] // Matching each journey with its corresponding vehicle
						}))
					}
				},
            },
            { new: true }
        );

		console.log("Updated Tow: ", updatedTow)

        // Return success response with the updated Tow document
        res.status(200).json({ data: updatedTow, success: true });
    } catch (error) {
        // Return error response
        res.status(500).json({ error: error.message, success: false });
    }
};




const deleteTowById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(500).json({ message: 'ID parameter is missing' });
		}
		const deletedTow = await Tow.findByIdAndDelete(id);
		if (!deletedTow) {
			return res.status(404).json({ message: 'Tow session not found' });
		}
		res.status(200).json({
			data: deletedTow,
			success: true,
			message: 'Delete tow session successful',
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getTowById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(500).json({ message: 'ID parameter is missing' });
		}
		const tow = await Tow.findById(id);
		if (!tow) {
			return res.status(404).json({ message: 'Tow session not found' });
		}
		res.status(200).json({
			data: tow,
			success: true,
			message: 'Fetch tow details successful',
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAllTows = async (req, res) => {
	try {
		const tows = await Tow.find();
		res.status(200).json({
			data: tows,
			success: true,
			message: 'Fetch all tow details successful',
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const  towStatus = async (req, res) => {
	console.log(req.body);
	try {
		const {vehicles} = req.body;
        // Search the tow database for the latest data based on the vehicle ID
        // const latestTow = await Tow.findOne({ vehicles }).sort({ 'journey.startTime': -1 }).limit(1);
		// const latestTow = await Tow.findOne({ 'journey.vehicle': { $in: vehicles } }).sort({ 'journey.startTime': -1 }).limit(1);
		
		const latestTow = await Tow.findOne({ 'licenseNumber': { $in: vehicles } }).sort({ 'journey.startTime': -1 }).limit(1);


		console.log(latestTow)

        if (!latestTow) {
            return res.status(500).json({ message: 'Tow data not found for the provided vehicle ID' });
        }

        // Assuming you have a Vehicle model/schema defined and a method to query the database
        // const vehicle = await Vehicle.findOne({ _id: vehicleId });

        // if (!vehicle) {
        //     throw new Error('Vehicle not found for the provided vehicle ID');
        // }

        // Post the current location based on the latest tow data
        // const currentLocation = {
        //     latitude: latestTow.journey[0].lat,
        //     longitude: latestTow.journey[0].long
        // };

		// Check if the session is ongoing
        const isSessionOngoing = latestTow.sessionEnd === 'false';

        let currLocation;
        if (isSessionOngoing) {
            // If session is ongoing, get the current location from the latest tow data
            currLocation = {
                latitude: latestTow.currentLocation.lat,
                longitude: latestTow.currentLocation.long
            };
        } else {
            // If session is ended, get the location from the last ended session
            // const lastEndedSession = await Tow.findOne({ 'journey.vehicle': { $in: vehicles }, status: 'ended' }).sort({ timestamp: -1 }).limit(1);
			const lastEndedSession = await Tow.findOne({ 'licenseNumber': { $in: vehicles } }).sort({ 'journey.startTime': -1 }).limit(1);
            if (!lastEndedSession) {
                return res.status(500).json({ message: 'No ended session found for the provided vehicle ID' });
            }
            currLocation = {
                latitude: lastEndedSession.journey[lastEndedSession.journey.length - 1].lat,
                longitude: lastEndedSession.journey[lastEndedSession.journey.length - 1].long
            };
        }

        console.log(`Current location of vehicle with ID ${vehicles}:`, currLocation);

        // You can now post the current location or use it as needed in your application
		res.status(200).json({
			location: currLocation,
			success: true,
			message: "Location Sent Successfully"
		})
        // return currentLocation;
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
	createTow,
	updateTowById,
	deleteTowById,
	getTowById,
	getAllTows,
	towStatus
};
