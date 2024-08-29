const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ExpenseFile = sequelize.define('expenseFile', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    downloadedFileUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    }
});

module.exports = ExpenseFile;