const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Define a simple route (GET request)
app.get('/api', (req, res) => {
  res.send('Hello from the API!');
});


// Your routes go here
app.get('/api/attendance', (req, res) => {
  // Example data
  res.json([
    { name: 'John Doe', status: 'Present' },
    { name: 'Jane Smith', status: 'Absent' },
  ]);
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});