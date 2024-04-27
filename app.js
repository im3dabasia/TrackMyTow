// app.js
const express = require('express');
const cors = require('cors');
var cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

// Middlewares
const verifyToken = require('./middlewares/tokenAuth');
const checkRole = require('./middlewares/checkRole');
const urlParser = require('./middlewares/urlParser.js');

//routes
const vehicleRoutes = require('./routes/vehicleRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const towRoutes = require('./routes/towRoutes.js');

// Connect to MongoDB
const app = express();
connectDB();

// Middlewares
app.use(express.json());
const corsOptions = {
	origin: true,
	credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(urlParser());

// Routes
// app.use('/api', vehicleRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/role', verifyToken, checkRole(['Admin']), roleRoutes);
app.use('/api/tow', towRoutes);
app.use(
	'/api/vehicle',
	verifyToken,
	checkRole(['Admin', 'Police']),
	vehicleRoutes
);

module.exports = app;
