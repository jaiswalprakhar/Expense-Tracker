const path = require('path');
const express = require('express');

const purchaseController = require('../controllers/purchase');
const userAuthentication = require('../middlewares/auth');

const router = express.Router();

router.get('/premium-membership', userAuthentication.authenticate, purchaseController.purchasePremium);

router.post('/update-transaction-status', userAuthentication.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;