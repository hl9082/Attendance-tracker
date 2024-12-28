// _models/Attendance.js
const { DataTypes } = require('sequelize');
const sequelize = require('./Database');  // Import the sequelize instance
const User = require('./User');  // Import the User model

const Attendance = sequelize.define('Attendance', {
  attendance_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  time_in: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  time_out: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Present', 'Absent', 'Late']],
    },
  },
});

// Foreign key relationship with the User model
Attendance.belongsTo(User, { foreignKey: 'student_id' });

module.exports = Attendance;


