const path = require('path');
const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/create-user', userController.createUser);

router.post('/login-user', userController.loginUser);

module.exports = router;