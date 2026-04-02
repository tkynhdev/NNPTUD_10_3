const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const userController = require('../controllers/userController');

router.post('/', roleController.createRole);
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

// endpoint 4: All users for a role
router.get('/:id/users', userController.getUsersByRoleId);

module.exports = router;
