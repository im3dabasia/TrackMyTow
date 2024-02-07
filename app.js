// app.js
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
// const connectDB = require('./config/db');
// const vehicleRoutes = require('./routes/vehicleRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect to MongoDB
// connectDB();
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(express.json({ limit: '50mb' }));
app.use(cors());

const dbUrl = process.env.MONGO_URI;
mongoose.connect(dbUrl)
  .then(function () {
    console.log("database connected!");
  })
  .catch(function (err) {
    console.log(err);
  });



// Middleware
// app.use(express.json());

// Routes
// app.use('/vehicles', vehicleRoutes);
app.use('/users', userRoutes);

module.exports = app;
