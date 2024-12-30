// attendance.js
const express = require('express');
const bcrypt = require('bcryptjs');
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

// Post attendance
router.post('/attendance', authenticate, async (req, res) => {
  const { name, date } = req.body;
  try {
    const user = await User.findByPk(req.user.userId);  // Fetch user using the decoded token ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      name,
      date,
      userId: user.id, // Save the user ID from the JWT token
    });

    res.status(201).json(attendance);  // Return the created attendance record
  } catch (error) {
    console.error('Error creating attendance:', error);  // Log the error on the server
    res.status(500).json({ message: 'Error creating attendance' });
  }
});

module.exports = router;


