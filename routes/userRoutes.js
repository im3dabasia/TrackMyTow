const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Middlewares
const verifyToken = require('../middlewares/tokenAuth');
const checkRole = require('../middlewares/checkRole');
const { isValidMongoObjectId } = require('../middlewares/validateId');
const errorHandeler = require('../middlewares/errorHandeler');

router.post('/register', authController.signUp, errorHandeler);
router.post('/login', authController.login, errorHandeler);
router.post('/logout', verifyToken, authController.logout, errorHandeler);

router.get(
	'/users',
	verifyToken,
	checkRole(['Admin']),
	authController.getUsers,
	errorHandeler
);
router.get(
	'/users/:id',
	isValidMongoObjectId,
	authController.getUserById,
	errorHandeler
);
router.put(
	'/users/:id',
	isValidMongoObjectId,
	authController.updateUserById,
	errorHandeler
);
router.delete(
	'/users/:id',
	isValidMongoObjectId,
	authController.deleteUserById,
	errorHandeler
);

module.exports = router;
