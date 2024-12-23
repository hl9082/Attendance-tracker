const express = require('express');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');
const fs = require('fs');

// Set up express
const app = express();

// Initialize face-api.js with the canvas library
faceapi.env.monkeyPatch({ Canvas: canvas.Canvas, Image: canvas.Image, ImageData: canvas.ImageData });

// Load models (assuming the models are in a 'models' folder)
const MODEL_PATH = path.join(__dirname, 'models');
faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH).then(() => {
  console.log('Models loaded');
});

// Set up the route for facial recognition
app.post('/recognize', async (req, res) => {
  // Assuming you are sending an image in the request body
  const image = req.body.image;  // You would need to handle image upload here

  const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
  
  res.json(detections);  // Return the facial detection results
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
