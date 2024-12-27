const express = require('express');
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
  const { biometricData } = req.body;

  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Biometric verification (use real verification logic here)
    const isBiometricValid = await bcrypt.compare(biometricData, user.biometrics);
    if (!isBiometricValid) {
      return res.status(400).json({ message: 'Biometric verification failed' });
    }

    const attendance = await Attendance.create({
      userId: user.id,
      status: 'IN',
    });

    res.status(201).json({ message: 'Clock-in recorded', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error clocking in', error });
  }
});

// Clock-out
router.post('/clock-out', authenticate, async (req, res) => {
  const { biometricData } = req.body;

  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Biometric verification (use real verification logic here)
    const isBiometricValid = await bcrypt.compare(biometricData, user.biometrics);
    if (!isBiometricValid) {
      return res.status(400).json({ message: 'Biometric verification failed' });
    }

    const attendance = await Attendance.create({
      userId: user.id,
      status: 'OUT',
    });

    res.status(201).json({ message: 'Clock-out recorded', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error clocking out', error });
  }
});

module.exports = router;
