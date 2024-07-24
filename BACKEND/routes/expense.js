const path = require('path');
const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.get('/get-expense', expenseController.getExpenses);

router.post('/create-expense', expenseController.postExpense);

router.delete('/delete-expense', expenseController.deleteExpense);

router.get('/get-edit-expense', expenseController.getEditExpense);

router.patch('/post-edit-expense', expenseController.postEditExpense);

module.exports = router;