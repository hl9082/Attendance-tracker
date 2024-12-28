const express = require('express');
const cors = require('cors');
const { Attendance } = require('./models/Attendance');  // Import Attendance model from Sequelize
const app = express();

// Use CORS for cross-origin requests
app.use(cors());

// For parsing JSON bodies
app.use(express.json());

// Simple root route to check if server is running
app.get('/', (req, res) => {
  res.send('Welcome to the Attendance API!');
});

// Endpoint to register attendance (POST)
app.post('/attendance', async (req, res) => {
  const { student_id, status } = req.body; // Assuming student_id and status are sent in the request body

  if (!student_id || !status) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Validating the status input
  if (!['Present', 'Absent', 'Late'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status. Must be Present, Absent, or Late' });
  }

  try {
    // Creating an attendance record linked to the student_id
    const attendanceRecord = await Attendance.create({
      student_id: student_id, // The student_id is linked to a user in the database
      status: status,         // The attendance status: Present, Absent, or Late
      date: new Date(),       // Automatically set the current date
      time_in: new Date(),    // Automatically set the current time for time_in
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
    const attendanceRecords = await Attendance.findAll();  // Fetch all attendance records from the database

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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

