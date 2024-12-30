const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

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

// Clock-in Route
app.post('/clock-in', authenticate, async (req, res) => {
  const { biometricData } = req.body; // Biometric data from client

  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isBiometricValid = await bcrypt.compare(biometricData, user.biometrics);
    if (!isBiometricValid) {
      return res.status(400).json({ message: 'Biometric verification failed' });
    }

    // Create attendance record for clock-in
    const attendance = await Attendance.create({
      userId: user.id,  // Set user ID from JWT token
      status: 'Present',  // Clock-in status: Present, Late, etc.
      time_in: new Date(),  // Set current time as clock-in time
    });

    res.status(201).json({ message: 'Clock-in recorded', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error clocking in', error });
  }
});

// Clock-out Route
app.post('/clock-out', authenticate, async (req, res) => {
  const { biometricData } = req.body; // Biometric data from client

  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isBiometricValid = await bcrypt.compare(biometricData, user.biometrics);
    if (!isBiometricValid) {
      return res.status(400).json({ message: 'Biometric verification failed' });
    }

    // Find the most recent attendance record for this user (clock-in without clock-out yet)
    const attendance = await Attendance.findOne({
      where: { userId: user.id, time_out: null },
      order: [['time_in', 'DESC']],
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No clock-in found for user' });
    }

    // Update the attendance record with clock-out time
    attendance.time_out = new Date();
    attendance.status = 'Present'; // You can modify status based on business logic (e.g., Late)
    await attendance.save();

    res.status(200).json({ message: 'Clock-out recorded', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error clocking out', error });
  }
});

// Endpoint to register attendance (POST)
app.post('/attendance', async (req, res) => {
  const { name, date } = req.body; // Name and Date sent from frontend

  if (!name || !date) {
    return res.status(400).json({ success: false, message: 'Name and Date are required' });
  }

  try {
    const user = await User.findOne({ where: { name } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const attendanceRecord = await Attendance.create({
      userId: user.id,  // Link attendance to user
      status: 'Present', // Default status, could be adjusted
      date: new Date(date),  // Use the passed date
      time_in: new Date(),  // Current time as clock-in time
    });

    return res.status(200).json({
      success: true,
      message: 'Attendance recorded successfully!',
      attendanceRecord,
    });
  } catch (error) {
    console.error('Error creating attendance record:', error);
    return res.status(500).json({
      success: false,
      message: 'Error recording attendance',
      error: error.message,
    });
  }
});

// Endpoint to fetch all attendance records (GET)
app.get('/attendance', async (req, res) => {
  try {
    const attendanceRecords = await Attendance.findAll(); // Fetch all attendance records

    return res.status(200).json({
      success: true,
      data: attendanceRecords,
    });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message,
    });
  }
});

// Test the SQLite connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // SQLite database file
});

sequelize.authenticate()
  .then(() => {
    console.log('SQLite database connected successfully');
  })
  .catch((err) => {
    console.error('Unable to connect to the SQLite database:', err);
  });

// Sync models (create tables if they don't exist)
sequelize.sync({ force: false })  // Set force: false to avoid dropping the tables every time
  .then(() => {
    console.log('Database tables created/verified.');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


