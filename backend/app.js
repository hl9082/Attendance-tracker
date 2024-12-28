const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { Sequelize } = require('sequelize');  // Import Sequelize
const User = require('./models/User');  // Import User model
const Attendance = require('./models/Attendance');  // Import Attendance model

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

// Sync models (create tables if they don't exist)
sequelize.sync({ force: false })  // Set force: false to avoid dropping the tables every time
  .then(() => {
    console.log('Database tables created/verified.');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route for a simple welcome message
app.get('/', (_req, res) => {
  res.send('Welcome to the Attendance API!');
});

// Example: Fetch a user by ID and log attendance
app.get('/test-user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the user's attendance (example)
    const attendance = await Attendance.create({
      userId: user.id,
      status: 'IN',  // Example: mark as 'IN' for clocking in
    });

    // Respond with the user data and attendance record
    res.json({ user, attendance });
  } catch (error) {
    console.error('Error processing user and attendance:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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



