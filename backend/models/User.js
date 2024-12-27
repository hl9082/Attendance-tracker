const { DataTypes } = require('sequelize');
const { sequelize } = require('../app');  // Correctly import sequelize from app.js

// Define the User model
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  biometrics: {
    type: DataTypes.STRING,
    allowNull: false, // Store hashed biometric data
  }
}, {
  tableName: 'users', // Table name in SQLite
  timestamps: true, // Sequelize will automatically add createdAt and updatedAt fields
});

module.exports = User;


