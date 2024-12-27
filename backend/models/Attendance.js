const { DataTypes } = require('sequelize');
const sequelize = require('../app').sequelize;
const User = require('./User'); // Import User model

// Define the Attendance model
const Attendance = sequelize.define('Attendance', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,  // Reference to the User model
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('IN', 'OUT'),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'attendances',
  timestamps: false, // No need for createdAt and updatedAt
});

// Establish relationship between User and Attendance (One-to-Many)
User.hasMany(Attendance, { foreignKey: 'userId' });
Attendance.belongsTo(User, { foreignKey: 'userId' });

module.exports = Attendance;

