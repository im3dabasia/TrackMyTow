const { faker } = require('@faker-js/faker/locale/en_IND');
// const faker = require('faker/locale/en_IND');

const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');

// helpers
const generateRandomAlphanumeric = (length) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
};

const connectDB = async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://im3d:im3d@test.h7qatqe.mongodb.net/?retryWrites=true&w=majority'
		);
		console.log('MongoDB connected');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error.message);
		process.exit(1);
	}
};

connectDB();

const generateFakeVehicle = () => {
	const registrationDate = faker.date.past();

	const districts = [
		{ name: 'Ahmedabad', number: 'GJ01' },
		{ name: 'Mehsana', number: 'GJ02' },
		{ name: 'Rajkot', number: 'GJ03' },
		{ name: 'Bhavnagar', number: 'GJ04' },
		{ name: 'Surat', number: 'GJ05' },
		{ name: 'Vadodra', number: 'GJ06' },
		{ name: 'Nadiad', number: 'GJ07' },
		{ name: 'Palanpur', number: 'GJ08' },
		{ name: 'Himmatnagar', number: 'GJ09' },
		{ name: 'Jamnagar', number: 'GJ10' },
		{ name: 'Junagadh', number: 'GJ11' },
		{ name: 'Bhuj', number: 'GJ12' },
		{ name: 'Surendranagar', number: 'GJ13' },
		{ name: 'Amreli', number: 'GJ14' },
		{ name: 'Valsad', number: 'GJ15' },
		{ name: 'Bharuch', number: 'GJ16' },
		{ name: 'Godhra', number: 'GJ17' },
		{ name: 'Gandhinagar', number: 'GJ18' },
		{ name: 'Bardoli', number: 'GJ19' },
		{ name: 'Dahod', number: 'GJ20' },
		{ name: 'Navsari', number: 'GJ21' },
		{ name: 'Rajpipla', number: 'GJ22' },
		{ name: 'Anand', number: 'GJ23' },
		{ name: 'Patan', number: 'GJ24' },
		{ name: 'Porbander', number: 'GJ25' },
		{ name: 'Vyara', number: 'GJ26' },
		{ name: 'Ahmedabad East', number: 'GJ27' },
		{ name: 'Surat Pal', number: 'GJ28' },
		{ name: 'Vadodara Darjipura', number: 'GJ29' },
		{ name: 'AhvaDang', number: 'GJ30' },
		{ name: 'Modasa', number: 'GJ31' },
		{ name: 'Veraval', number: 'GJ32' },
		{ name: 'Botad', number: 'GJ33' },
		{ name: 'Chhota Udepur', number: 'GJ34' },
		{ name: 'Lunawada', number: 'GJ35' },
		{ name: 'Morbi', number: 'GJ36' },
	];

	const locationOfRegistration =
		districts[Math.floor(Math.random() * districts.length)];

	const passingLocation = locationOfRegistration.name;
	const passingNumber = locationOfRegistration.number;

	const randomNumber = locationOfRegistration.number;
	const randomAlphanumeric = generateRandomAlphanumeric(5);

	const licenseNumber = `${passingNumber}${randomAlphanumeric}`;
	return {
		licenseNumber,
		type: faker.vehicle.type(),
		make: faker.vehicle.manufacturer(),
		model: faker.vehicle.model(),
		color: faker.vehicle.color(),
		registrationDate,
		ownerName: faker.person.fullName(),
		ownerEmail: faker.internet.email(),
		ownerPhone: '+91' + faker.phone.number('##########'),
		locationOfRegistration: passingLocation,
	};
};

const createFakeVehicles = async (count) => {
	let fakeVehicles = [];
	for (let i = 1; i < count + 1; i++) {
		const fakeVehicle = generateFakeVehicle();
		fakeVehicles.push(fakeVehicle);
		// console.log(fakeVehicles[0]);
		if (i % 10000 === 0) {
			await Vehicle.insertMany(fakeVehicles);
			console.log(`inserted data for vehicle ${i - 10000} ${i}`);
			fakeVehicles = [];
		}
	}
	console.log(`${count} fake vehicles created successfully.`);
};
// Generate 100 fake vehicles

setTimeout(() => {
	createFakeVehicles(100000);
}, 5000);
