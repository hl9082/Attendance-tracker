const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { Sequelize } = require('sequelize');  // Import Sequelize
const User = require('./models/User');  // Import User model
const Attendance = require('./models/Attendance');  // Import Attendance model
const readline = require('readline');
const fs = require('fs');

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

// Terminal input setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for user input and create data
const createUserFromInput = async () => {
  rl.question('Enter email: ', async (email) => {
    rl.question('Enter password: ', async (password) => {
      rl.question('Enter biometrics data: ', async (biometrics) => {
        try {
          // Creating a new user in the database
          const user = await User.create({
            email,
            password,
            biometrics,
          });
          console.log('User created:', user);
        } catch (error) {
          console.error('Error creating user:', error);
        }
        rl.close();
      });
    });
  });
};

// Function to read data from a JSON file and insert into database
const createUserFromFile = async (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(data);

    for (const userData of users) {
      const { email, password, biometrics } = userData;
      const user = await User.create({
        email,
        password,
        biometrics,
      });
      console.log('User created:', user);
    }
  } catch (error) {
    console.error('Error reading file or creating users:', error);
  }
};

// Function to create attendance from input
const createAttendanceFromInput = async () => {
  rl.question('Enter User ID for attendance: ', async (userId) => {
    rl.question('Enter attendance status (IN/OUT): ', async (status) => {
      try {
        // Creating an attendance record linked to a user
        const attendance = await Attendance.create({
          userId,
          status,
        });
        console.log('Attendance recorded:', attendance);
        rl.close();
      } catch (error) {
        console.error('Error creating attendance:', error);
      }
    });
  });
};

// Function to read attendance from a file
const createAttendanceFromFile = async (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const attendances = JSON.parse(data);

    for (const attendanceData of attendances) {
      const { userId, status } = attendanceData;
      const attendance = await Attendance.create({
        userId,
        status,
      });
      console.log('Attendance recorded:', attendance);
    }
  } catch (error) {
    console.error('Error reading file or creating attendance:', error);
  }
};

// Choose data entry method
const chooseDataEntryMethod = () => {
  rl.question('Do you want to enter data via Terminal (T) or File (F)? ', (choice) => {
    if (choice.toUpperCase() === 'T') {
      rl.question('Enter type of data to create (user/attendance): ', (type) => {
        if (type.toLowerCase() === 'user') {
          createUserFromInput();
        } else if (type.toLowerCase() === 'attendance') {
          createAttendanceFromInput();
        } else {
          console.log('Invalid option.');
          rl.close();
        }
      });
    } else if (choice.toUpperCase() === 'F') {
      rl.question('Enter the type of data file (user/attendance): ', (type) => {
        rl.question('Enter the file path: ', (filePath) => {
          if (type.toLowerCase() === 'user') {
            createUserFromFile(filePath);
          } else if (type.toLowerCase() === 'attendance') {
            createAttendanceFromFile(filePath);
          } else {
            console.log('Invalid option.');
            rl.close();
          }
        });
      });
    } else {
      console.log('Invalid option.');
      rl.close();
    }
  });
};

// Call the method to choose how to enter data
chooseDataEntryMethod();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route for a simple welcome message
app.get('/', (_req, res) => {
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



