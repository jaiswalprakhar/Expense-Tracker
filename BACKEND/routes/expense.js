const path = require('path');
const express = require('express');

const expenseController = require('../controllers/expense');
const userAuthentication = require('../middlewares/auth');

const router = express.Router();

router.get('/get-expense', userAuthentication.authenticate, expenseController.getExpenses);

router.post('/create-expense', userAuthentication.authenticate, expenseController.postExpense);

router.delete('/delete-expense/:id', userAuthentication.authenticate, expenseController.deleteExpense);

router.get('/get-edit-expense/:id', userAuthentication.authenticate, expenseController.getEditExpense);

router.patch('/post-edit-expense/:id', userAuthentication.authenticate, expenseController.postEditExpense);

module.exports = router;