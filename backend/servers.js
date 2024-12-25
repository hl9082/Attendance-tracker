const express = require('express');
const multer = require('multer');
const faceapi = require('face-api.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // To serve uploaded images (optional)

// Connect to MongoDB (replace with your DB URL)
mongoose.connect('mongodb://localhost:27017/attendanceApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Attendance Model
const Attendance = mongoose.model('Attendance', new mongoose.Schema({
  name: String,
  date: { type: Date, default: Date.now },
  imageUrl: String,
}));

// File upload configuration (multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Endpoint to handle facial recognition from uploaded image
app.post('/recognize', upload.single('image'), async (req, res) => {
  const image = req.file;
  if (!image) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  // Perform facial recognition here (you may need to load face-api.js models)
  // Placeholder for facial recognition (simplified)
  const detectedFaces = await faceapi.detectAllFaces(image.path);
  if (detectedFaces.length > 0) {
    const token = 'mock_token_for_recognized_user'; // Token from successful facial recognition
    return res.json({ success: true, token });
  } else {
    return res.status(400).json({ error: 'No faces detected' });
  }
});

// Attendance endpoint (store attendance records)
app.post('/attendance', async (req, res) => {
  const { name, imageUrl } = req.body;
  if (!name || !imageUrl) {
    return res.status(400).json({ error: 'Name and image URL required' });
  }

  const attendance = new Attendance({ name, imageUrl });
  await attendance.save();
  res.status(200).json({ success: true, message: 'Attendance recorded' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

