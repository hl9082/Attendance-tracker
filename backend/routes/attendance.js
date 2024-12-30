// attendance.js
const express = require('express');
const Attendance = require('../models/Attendance'); // Adjust the path as necessary
const User = require('../models/User'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');
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

// Post attendance - Mark Attendance route
router.post('/attendance', authenticate, async (req, res) => {
  const { name, date } = req.body;

  if (!name || !date) {
    return res.status(400).json({ message: 'Name and date are required' });
  }

  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      name,
      date,
      userId: user.id,
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({ message: 'Error creating attendance' });
  }
});

module.exports = router;





