// attendance.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Clean token from 'Bearer ' prefix
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
    req.user = decoded;  // Attach user info from the token
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

// POST: Login route (with bcrypt password verification)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { username } });  // Find user by username
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Compare the password entered by the user with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate a JWT token if the password is correct
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ message: 'Login successful', token });
    
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// POST: Attendance route (create attendance record)
router.post('/attendance', authenticate, async (req, res) => {
  const { name, date } = req.body;

  // Validation check for missing name or date
  if (!name || !date) {
    return res.status(400).json({ message: 'Name and Date are required.' });
  }

  try {
    const user = await User.findByPk(req.user.userId);  // Get user from the decoded token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create attendance record in the database
    const attendance = await Attendance.create({
      name,
      date,
      userId: user.id,  // Attach the user ID from the JWT token
    });

    res.status(201).json(attendance);  // Return the created attendance record

  } catch (error) {
    console.error('Error creating attendance:', error);  // Log the error on the server for debugging
    res.status(500).json({ message: 'Error creating attendance' });
  }
});

// GET: Fetch attendance for the logged-in user
router.get('/attendance', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);  // Get the logged-in user ID from the token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const attendanceRecords = await Attendance.findAll({
      where: { userId: user.id },  // Fetch attendance only for the logged-in user
      order: [['date', 'DESC']]  // Optional: Order attendance by date, latest first
    });

    res.status(200).json(attendanceRecords);  // Send attendance records as response
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance' });
  }
});

module.exports = router;




