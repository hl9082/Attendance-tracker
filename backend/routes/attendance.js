// attendance.js
const express = require('express');
const bcrypt = require('bcryptjs');  // Ensure bcrypt is imported
const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

// Clock-in
router.post('/clock-in', authenticate, async (req, res) => {
  const { biometricData } = req.body;  // This assumes the client sends biometric data (fingerprint/face recognition)

  try {
    const user = await User.findByPk(req.user.userId);  // Fetch user using the decoded token ID

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Biometric verification (use real verification logic here)
    const isBiometricValid = await bcrypt.compare(biometricData, user.biometrics);
    if (!isBiometricValid) {
      return res.status(400).json({ message: 'Biometric verification failed' });
    }

    // Create attendance record for clock-in
    const attendance = await Attendance.create({
      userId: user.id,  // Set user ID from JWT token
      status: 'Present',  // Status can be 'Present', 'Late', etc.
      time_in: new Date(),  // Set the current time as time_in
    });

    res.status(201).json({ message: 'Clock-in recorded', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error clocking in', error });
  }
});

// Clock-out
router.post('/clock-out', authenticate, async (req, res) => {
  const { biometricData } = req.body;  // Again, expect biometric data from the client

  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Biometric verification
    const isBiometricValid = await bcrypt.compare(biometricData, user.biometrics);
    if (!isBiometricValid) {
      return res.status(400).json({ message: 'Biometric verification failed' });
    }

    // Find the most recent attendance record for this user (where clock-out hasn't happened)
    const attendance = await Attendance.findOne({
      where: { userId: user.id, time_out: null },  // Find clock-in with no clock-out yet
      order: [['date', 'DESC']],
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No clock-in found for user' });
    }

    // Update attendance with clock-out time
    attendance.time_out = new Date();
    attendance.status = 'Present';  // Modify this if you want a more detailed status like 'Late'
    await attendance.save();

    res.status(200).json({ message: 'Clock-out recorded', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error clocking out', error });
  }
});

module.exports = router;

