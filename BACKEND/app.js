const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const errorController = require("./controllers/error");
const sequelize = require('./util/database');

const app = express();

app.use(cors());

const userRoutes = require('./routes/user');

app.use(express.json());

app.use('/user', userRoutes);

app.use(errorController.get404);

sequelize.sync()
.then(result => {
    app.listen(3000, () => {
        console.log(`Server listening at PORT 3000`);
    });
})
.catch(err => {
    console.log(err);
})