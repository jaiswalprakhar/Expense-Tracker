const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ForgotPassword = sequelize.define('forgotPassword', {
    id: {
      type: Sequelize.UUID,
      //defaultValue: uuidv4, // Automatically generate UUIDs
      allowNull: false,
      primaryKey: true
    },
    isActive: Sequelize.BOOLEAN,
    expiresBy: Sequelize.DATE
});

module.exports = ForgotPassword;