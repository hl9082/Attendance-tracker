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

// Dummy biometric verification (replace with real verification logic)
const verifyBiometricData = async (userId, biometricData) => {
  const user = await User.findById(userId);
  if (!user) return false;

  // Compare biometric data (hashed) - in a real system, this would use biometric matching
  const isMatch = await bcrypt.compare(biometricData, user.biometrics);
  return isMatch;
};

// Clock-in
router.post('/clock-in', authenticate, async (req, res) => {
  const { biometricData } = req.body;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Biometric verification
    const isBiometricValid = await verifyBiometricData(req.user.userId, biometricData);
    if (!isBiometricValid) {
      return res.status(400).json({ message: 'Biometric verification failed' });
    }

    const attendance = new Attendance({
      userId: user._id,
      status: 'IN',
    });

    await attendance.save();
    res.status(201).json({ message: 'Clock-in recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Error clocking in', error });
  }
});

// Clock-out
router.post('/clock-out', authenticate, async (req, res) => {
  const { biometricData } = req.body;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Biometric verification
    const isBiometricValid = await verifyBiometricData(req.user.userId, biometricData);
    if (!isBiometricValid) {
      return res.status(400).json({ message: 'Biometric verification failed' });
    }

    const attendance = new Attendance({
      userId: user._id,
      status: 'OUT',
    });

    await attendance.save();
    res.status(201).json({ message: 'Clock-out recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Error clocking out', error });
  }
});

module.exports = router;
