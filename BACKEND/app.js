const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
dotenv.config({ path: './.env' });
const bodyParser = require('body-parser');
const cors = require('cors');

const errorController = require("./controllers/error");
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgotPassword');
const ExpenseFile = require('./models/expenseFile');

const Port = process.env.PORT;

const app = express();

app.use(cors());

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature');
const forgotPasswordRoutes = require('./routes/forgotPassword');

app.use(express.json());

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', forgotPasswordRoutes);

//Error Handle for throwing errors manually
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ err: err.message });
  });

app.use(errorController.get404);

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Expense);

User.hasMany(Order);
Order.belongsTo(User);

ForgotPassword.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(ForgotPassword);

ExpenseFile.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(ExpenseFile);

sequelize.sync()
.then(result => {
    app.listen(Port, () => {
        console.log(`Server listening at PORT ${Port}`);
    });
})
.catch(err => {
    console.log(err);
})