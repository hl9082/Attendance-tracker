const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['IN', 'OUT'], required: true }, // IN for clock-in, OUT for clock-out
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
