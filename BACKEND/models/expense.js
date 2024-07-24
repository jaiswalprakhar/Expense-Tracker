const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expense = sequelize.define('expense', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            customValidator(value) {
              if (value <= 0) {
                throw new Error('Amount should be greater than 0');
              }
              else if(value === "") {
                throw new Error('Amount cannot be empty');
              }
            }
        }
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            noNumbers(value) {
                if (/\d/.test(value)) {
                    throw new Error('Description should not contain numbers');
                }
                else if(value === "") {
                  throw new Error('Description cannot be empty');
                }
                else if(value.length >= 100) {
                  throw new Error('Description should not contain more than 100 words');
                }
            }
        }
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            customValidator(value) {
              if (value === "Choose Category") {
                throw new Error("Choose Correct Category");
              }
            }
        }
    }
});

module.exports = Expense;