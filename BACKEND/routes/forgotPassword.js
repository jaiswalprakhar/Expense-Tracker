const path = require('path');
const express = require('express');

const verifyForgotPasswordLink = require('../middlewares/verifyForgotPasswordLink');
const forgotPasswordController = require('../controllers/forgotPassword');

const router = express.Router();

router.post('/forgot-password', forgotPasswordController.forgotPassword);

router.patch('/update-password', verifyForgotPasswordLink.authenticatePasswordLink, forgotPasswordController.updatePassword);

module.exports = router;