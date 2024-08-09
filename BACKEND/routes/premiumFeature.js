const path = require('path');
const express = require('express');

const premiumFeatureController = require('../controllers/premiumFeature');
const userAuthentication = require('../middlewares/auth');

const router = express.Router();

router.get('/showLeaderBoard', userAuthentication.authenticate, premiumFeatureController.getUserLeaderBoard);

module.exports = router;