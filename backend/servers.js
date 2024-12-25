const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Use CORS for cross-origin requests
app.use(cors());

// For parsing JSON bodies
app.use(express.json());

// Path to store the attendance data file
const ATTENDANCE_FILE_PATH = path.join(__dirname, 'attendance.json');

// Function to read attendance data from a file
function readAttendanceData() {
  if (fs.existsSync(ATTENDANCE_FILE_PATH)) {
    const data = fs.readFileSync(ATTENDANCE_FILE_PATH, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// Function to write attendance data to a file
function writeAttendanceData(records) {
  fs.writeFileSync(ATTENDANCE_FILE_PATH, JSON.stringify(records, null, 2), 'utf8');
}

// Endpoint to register attendance (POST)
app.post('/attendance', (req, res) => {
  const { name, imageUrl } = req.body;

  if (!name || !imageUrl) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const attendanceRecords = readAttendanceData();

  const attendanceRecord = { name, imageUrl, timestamp: new Date().toISOString() };

  // Add the new record to the list
  attendanceRecords.push(attendanceRecord);

  // Write the updated list back to the file
  writeAttendanceData(attendanceRecords);

  return res.status(200).json({ success: true, message: 'Attendance recorded!', attendanceRecord });
});

// Endpoint to fetch all attendance records (GET)
app.get('/attendance', (req, res) => {
  const attendanceRecords = readAttendanceData();
  return res.status(200).json({ success: true, data: attendanceRecords });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


