const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.getUserLeaderBoard = async (req, res) => {
    try {
        //Non-Optimised -
        /*const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpenses = {};

        expenses.forEach((expense) => {
            if(userAggregatedExpenses[expense.userId])  {
                userAggregatedExpenses[expense.userId] += expense.amount;
            }
            else {
                userAggregatedExpenses[expense.userId] = expense.amount;
            }
        });

        const userLeaderBoardDetails = [];
        users.forEach((user) => {
            userLeaderBoardDetails.push({ name: user.fullName, total_cost: userAggregatedExpenses[user.id] || 0 });
        })

        userLeaderBoardDetails.sort((a,b) => {
            return b.total_cost - a.total_cost;
        });
        console.log(userLeaderBoardDetails);
        res.status(200).json(userLeaderBoardDetails);*/
        
        // Very low optimised through attributes and GroupBy -
        /*const users = await User.findAll({
            attributes: ['id', 'fullName']
        });
        const userAggregatedExpenses = await Expense.findAll({
            attributes: ['userId', [sequelize.fn('sum', sequelize.col('expense.amount')), 'total_cost']],
            group: ['userId']
        });

        //console.log(userAggregatedExpenses);
        const mappedUserAggregatedExpense = {};
        userAggregatedExpenses.forEach((userData) => {
            mappedUserAggregatedExpense[userData.userId] =  userData.dataValues.total_cost;
        })

        //console.log(mappedUserAggregatedExpense);

        const userLeaderBoardDetails = [];
        users.forEach((user) => {
            userLeaderBoardDetails.push({ name: user.fullName, total_cost: mappedUserAggregatedExpense[user.id] || 0 });
        })

        //console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a, b) => {
            return b.total_cost - a.total_cost;
        });
        console.log(userLeaderBoardDetails);
        res.status(200).json(userLeaderBoardDetails);*/

        //Optimised Using Joins(One of the way which also used in Production) -
        /*const leaderBoardOfUsers = await User.findAll({
            attributes: ['id', 'fullName', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost'] ],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['total_cost', 'DESC']]
        });
        
        res.status(200).json(leaderBoardOfUsers);*/

        //More Optimised -
        const leaderBoardOfUsers = await User.findAll({
            attributes: ['fullName', 'totalExpenses'],
            order: [['totalExpenses', 'DESC']]
        });

        //console.log(leaderBoardOfUsers)
        
        res.status(200).json(leaderBoardOfUsers);
    } 
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}
