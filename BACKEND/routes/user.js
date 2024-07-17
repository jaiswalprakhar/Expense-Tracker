const path = require('path');
const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/create-user', userController.createUser);

module.exports = router;