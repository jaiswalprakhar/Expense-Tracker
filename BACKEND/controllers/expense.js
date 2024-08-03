const User = require('../models/user');
const Expense = require('../models/expense');
const { generateAccessToken } = require('../util/jwtUtil');

exports.getExpenses = async (req, res, next) => {
    try {
        const userExpense = await req.user.getExpenses();
        //console.log(req.user.isPremiumUser)
        if(userExpense.length > 0) {
            message = 'Expenses Fetched';
        }
        else {
            message = 'No Expenses Present';
        }
        res.status(200).json({
            message: message,
            userExpenses: userExpense,
            isPremiumUser: req.user.isPremiumUser
        });
    }
    catch(err) {
        console.log(err.message);
        next(err);
        //res.status(500).json({ err: err });
    }
}

exports.postExpense = async (req, res, next) => {
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;

    try {
        const expenseData = await req.user.createExpense({
            amount: amount,
            description: description,
            category: category
        })
        if(expenseData) {
            res.status(201).json({
                message: 'Expense Added',
                newExpense: expenseData,
                isPremiumUser: req.user.isPremiumUser
            });
        }
    }
    catch(err) {
        console.log(err);
        //next(err);
        res.status(500).json({ err: err});
    }
}

exports.deleteExpense = async (req, res) => {
    const expenseId =  req.params.id;
    try {
        const result = await Expense.destroy({ where: { id: expenseId } });
        if(result) {
            res.status(200).json( {message: `ExpenseId ${expenseId} expense Deleted`} );
        }
        else {
            res.status(404).json({ message: `ExpenseId ${expenseId} not present` });
        }
    }
    catch(err)  {
        console.log(err);
        res.status(500).json({ err: err});
    }
}

exports.getEditExpense = async (req, res, next) => {
    const expenseId =  req.params.id;
    try {
        const expenseData = await req.user.getExpenses({ where: { id: expenseId } });
        //console.log(expenseData.length, expenseData);
        if(expenseData.length > 0)  {
            res.status(200).json({
                message: 'Auto Filling Expense into Form from db',
                expense: expenseData[0]
            });
        }
        else {
            res.status(404).json({ message: `${expenseId} No such expense present` });   
        }
    }
    catch(err) {
        console.log(err);
        next(err);
        //res.status(500).json({err: err});
    }
}

exports.postEditExpense = async (req, res) => {
    const expenseId =  req.params.id;
    try {
        const updatedAmount = req.body.amount;
        const updatedDescription = req.body.description;
        const updatedCategory = req.body.category;

        const expenseData = await Expense.findByPk(expenseId);
        
        if (!expenseData) {
            console.log('Expense not found')
            return res.status(404).json({ message: 'Expense not found' });
        }
        
        if (updatedAmount !== undefined) {
            expenseData.amount = updatedAmount;
        }
        if (updatedDescription !== undefined) {
            expenseData.description = updatedDescription;
        }
        if (updatedCategory !== undefined) {
            expenseData.category = updatedCategory;
        }
        
        await expenseData.save();
        console.log('Data saved');
        
        res.status(200).json({
            message: 'Expense Edited',
            editedExpense: expenseData
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({err: err});
    }
}