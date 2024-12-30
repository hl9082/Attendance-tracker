// _models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const sequelize = require('./Database');  // Import the sequelize instance

const User = sequelize.define('User', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  biometric_data: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  password: {  // Add password field to store hashed passwords
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Hash password before saving to the database
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);  // Generate a salt
    user.password = await bcrypt.hash(user.password, salt);  // Hash the password before saving
  }
});

// Method to compare input password with stored hashed password
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);  // Compare hashed password
};

module.exports = User;



