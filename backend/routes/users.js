const express = require('express');

const auth = require('../middleware/auth');
const validators = require('../middleware/validators');
const userController = require('../controllers/users');

const router = express.Router();

router.post('/register', validators.userRegister, userController.register);
router.post('/addUser', auth.isAdmin, validators.userRegister, userController.register);
router.post('/login', userController.login);
router.get('/disable/:id', auth.isAdmin, userController.disableUser);
router.get('/all', auth.isAdmin, userController.getAll);

module.exports = router;