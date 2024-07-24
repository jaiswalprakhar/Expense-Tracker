const User = require('../models/user');
const Expense = require('../models/expense');

exports.getExpenses = async (req, res, next) => {
    const { userId } =  req.query;
    try {
        const user = await User.findByPk(userId);
        if(user) {
            req.user = user;
        }
        else {
            err = 'User Not Found';
            throw new Error(err);
        }
        const userExpense = await req.user.getExpenses();
        //console.log(userExpense.length);
        if(userExpense.length > 0) {
            message = 'Expenses Fetched';
        }
        else {
            message = 'No Expenses Present';
        }
        res.status(200).json({
            message: message,
            userExpenses: userExpense
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
    const { userId } =  req.query;

    try {
        const user = await User.findByPk(userId);
        if(user) {
            req.user = user;
        }
        else {
            throw new Error('User Not Found');
        }
        const expenseData = await req.user.createExpense({
            amount: amount,
            description: description,
            category: category
        })
        if(expenseData) {
            res.status(201).json({
                message: 'Expense Added',
                newExpense: expenseData
            });
        }
    }
    catch(err) {
        console.log(err.message);
        next(err);
        //res.status(500).json({ errorMessage: err});
    }
}

exports.deleteExpense = async (req, res) => {
    const { expenseId } =  req.query;
    try {
        const result = await Expense.destroy({ where: { id: expenseId } });
        if(result) {
            res.status(200).json( {message: `${expenseId} expense Deleted`} );
        }
        else {
            res.status(404).json({ message: `${expenseId} No such expense present` });
        }
    }
    catch(err)  {
        console.log(err);
        res.status(500).json({ err: err});
    }
}

exports.getEditExpense = async (req, res, next) => {
    const { userId, expenseId } =  req.query;
    try {
        const user = await User.findByPk(userId);
        if(user) {
            req.user = user;
        }
        else {
            throw new Error('User Not Found');
        }
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
    const { expenseId } =  req.query;
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