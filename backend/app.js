const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');

// Root route for a simple welcome message
app.get('/', (req, res) => {
  res.send('Welcome to the Attendance API!');
});

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useCreateIndex: true, 
  useFindAndModify: false
}).then(() => {
  console.log('Database connected successfully');
}).catch(err => {
  console.error('Database connection error:', err);
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

