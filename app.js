// app.js
const express = require('express');
const connectDB = require('./config/db');
const vehicleRoutes = require('./routes/vehicleRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect to MongoDB
connectDB();


// Middleware
app.use(express.json());

// Routes
app.use('/api', vehicleRoutes);
app.use('/api', userRoutes);

module.exports = app;
