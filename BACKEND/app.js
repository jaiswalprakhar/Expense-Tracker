const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const errorController = require("./controllers/error");
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');

const app = express();

app.use(cors());

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

app.use(express.json());

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

//Error Handle for throwing errors manually
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ err: err.message });
  });

app.use(errorController.get404);

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Expense);

sequelize.sync()
.then(result => {
    app.listen(3000, () => {
        console.log(`Server listening at PORT 3000`);
    });
})
.catch(err => {
    console.log(err);
})