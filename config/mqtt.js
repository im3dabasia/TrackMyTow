// config/mqtt.js
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://your-mqtt-broker-url');

module.exports = client;
