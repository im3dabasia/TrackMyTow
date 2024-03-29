const express = require('express');
const router = express.Router();
const towController = require('../controllers/towController');

router.post('/tows', towController.createTow);

router.put('/tows/:id', towController.updateTowById);

router.delete('/tows/:id', towController.deleteTowById);

router.get('/tows/:id', towController.getTowById);

router.get('/tows', towController.getAllTows);

module.exports = router;
