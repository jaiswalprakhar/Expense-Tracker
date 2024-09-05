const User = require('../models/user');
const Expense = require('../models/expense');
const ExpenseFile = require('../models/expenseFile');
const { generateAccessToken } = require('../util/jwtUtil');
const sequelize = require('../util/database');
//const UserServices = require('../services/userServices');
const S3Services = require('../services/s3Services');

const ITEMS_PER_PAGE = 2;

exports.getExpenses = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const limit = ITEMS_PER_PAGE;

        // Using Promises -
        const totalItemsPromise = req.user.countExpenses();
        
        const userExpensePromise = Expense.findAll({
            where: {
                userId: req.user.id,
            },
            offset,
            limit
        });

        const expenseFileDataPromise = req.user.getExpenseFiles();

        const [totalItems, userExpense, expenseFileData] = await Promise.all([
            totalItemsPromise,
            userExpensePromise,
            expenseFileDataPromise
        ]);

        const message = (userExpense.length > 0) ? 'Expenses Fetched' : 'No Expenses Present';

        console.log(`totalItems = ${totalItems}`);
        res.status(200).json({
            message: message,
            expenseFileData: expenseFileData,
            userExpenses: userExpense,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
    }
    catch(err) {
        console.log(err.message);
        next(err);
        //res.status(500).json({ err: err });
    }
}

/*exports.getExpenses = async (req, res, next) => {
    try {
        const userExpense = await req.user.getExpenses();
        const expenseFileData = await req.user.getExpenseFiles();
        
        if(userExpense.length > 0) {
            message = 'Expenses Fetched';
        }
        else {
            message = 'No Expenses Present';
        }
        res.status(200).json({
            message: message,
            userExpenses: userExpense,
            expenseFileData: expenseFileData
        });
    }
    catch(err) {
        console.log(err.message);
        next(err);
        //res.status(500).json({ err: err });
    }
}*/

exports.postExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;

    try {
        const expenseData = await req.user.createExpense({
            amount: amount,
            description: description,
            category: category
        }, { transaction: t })

        const updatedAmount = Number(req.user.totalExpenses) + Number(amount);
        if (updatedAmount !== undefined) {
            req.user.totalExpenses = updatedAmount;
            await req.user.save({ transaction: t });
        }

        await t.commit();

        if(expenseData) {
            res.status(201).json({
                message: 'Expense Added',
                newExpense: expenseData,
                isPremiumUser: req.user.isPremiumUser
            });
        }
    }
    catch(err) {
        await t.rollback();
        console.log(err);
        //next(err);
        res.status(500).json({ err: err});
    }
}

exports.deleteExpense = async (req, res) => {
    const t = await sequelize.transaction();
    const expenseId =  req.params.id;
    try {
        const expense = await req.user.getExpenses({ where: { id: expenseId } });
        //console.log(expense[0].dataValues.amount);

        //const result = await Expense.destroy({ where: { id: expenseId } }, { transaction: t });
        const result = await expense[0].destroy({ transaction: t });

        if(expense) {
            const updatedAmount = req.user.totalExpenses - expense[0].dataValues.amount;
            if (updatedAmount !== undefined) {
                req.user.totalExpenses = updatedAmount;
                await req.user.save({ transaction: t });
            }
        }

        if(result) {
            await t.commit();
            res.status(200).json( {message: `ExpenseId ${expenseId} expense Deleted`} );
        }
        else {
            res.status(404).json({ message: `ExpenseId ${expenseId} not present` });
        }
    }
    catch(err)  {
        await t.rollback();
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
    const t = await sequelize.transaction();
    const expenseId =  req.params.id;
    try {
        const updatedAmount = req.body.amount;
        const updatedDescription = req.body.description;
        const updatedCategory = req.body.category;

        //const expenseData = await Expense.findByPk(expenseId);
        const expenseData = await req.user.getExpenses({ where: { id: expenseId } });

        if (!expenseData[0]) {
            console.log('Expense not found')
            return res.status(404).json({ message: 'Expense not found' });
        }
        
        if (updatedAmount !== undefined) {
            req.user.totalExpenses = req.user.totalExpenses + (Number(updatedAmount) - expenseData[0].amount);
            
            expenseData[0].amount = updatedAmount;
        }
        if (updatedDescription !== undefined) {
            expenseData[0].description = updatedDescription;
        }
        if (updatedCategory !== undefined) {
            expenseData[0].category = updatedCategory;
        }
        
        await expenseData[0].save({ transaction: t });
        console.log('Expense Data saved');

        await req.user.save({ transaction: t });
        console.log('Total Expenses Data saved');

        await t.commit();
        
        res.status(200).json({
            message: 'Expense Edited',
            editedExpense: expenseData[0]
        });
    }
    catch(err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({err: err});
    }
}

exports.downloadExpense = async (req, res) => {
    try {
        const premiumUser = req.user.isPremiumUser;
        if(!premiumUser) {
            return res.status(401).json({
                err: 'User Not Authorised'
            })
        }
        const expenses = await req.user.getExpenses();
        const stringifiedExpenses = JSON.stringify(expenses);
        console.log(expenses);
        console.log(stringifiedExpenses);
        const userId = req.user.id;
        const fileName = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await S3Services.uploadToS3(stringifiedExpenses, fileName);

        if(fileURL !== undefined || fileURL !== '') {
            const dowloadedFileData = await req.user.createExpenseFile({
                downloadedFileUrl: fileURL
            })
        }

        res.status(200).json({ 
            message: 'File Downloaded Successfully',
            downloadedFileUrl: fileURL,
            success: true });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            fileURL: '',
            err: err,
            success: false
        })
    }
}