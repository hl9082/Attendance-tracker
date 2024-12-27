const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { Sequelize } = require('sequelize');  // Import Sequelize

dotenv.config();

const app = express();

// Initialize SQLite database with Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // SQLite database file (it will be created if it doesn't exist)
});

// Test the SQLite connection
sequelize.authenticate()
  .then(() => {
    console.log('SQLite database connected successfully');
  })
  .catch((err) => {
    console.error('Unable to connect to the SQLite database:', err);
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route for a simple welcome message
app.get('/', (req, res) => {
  res.send('Welcome to the Attendance API!');
});

// Import routes
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// Export the sequelize instance so it can be used elsewhere (like in User.js)
module.exports = {
  sequelize,
  app,
};

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



