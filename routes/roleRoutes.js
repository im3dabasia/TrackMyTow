const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { isValidMongoObjectId } = require('../middlewares/validateId');

router.get('/roles/:id', isValidMongoObjectId, roleController.getRoleById);
router.get('/roles', roleController.getAllRoles);
router.get('/roles/arch', roleController.getAllDeactivatedRoles);
router.post('/roles', roleController.createRole);
router.put('/roles/:id', isValidMongoObjectId, roleController.updateRole);
router.delete('/roles/:id', isValidMongoObjectId, roleController.deleteRole);

module.exports = router;
