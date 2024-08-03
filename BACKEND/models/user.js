const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    fullName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            noNumbers(value) {
                if (/\d/.test(value)) {
                    throw new Error('Name should not contain numbers');
                }
                else if(value === "") {
                  throw new Error('Name cannot be empty');
                }
            }
        }
    },
    emailId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        /*validate: {
            customValidator(value) {
                if(value.length < 8 || value.length > 15) {
                  throw new Error('Password should be 8 to 10 characters long');
                }
            }
        }*/
    },
    isPremiumUser: Sequelize.BOOLEAN
});

module.exports = User;