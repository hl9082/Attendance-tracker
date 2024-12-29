// src/components/FacialRecognition.js

import React, { useState, useRef } from 'react';
import { startCamera, stopCamera, captureImage } from '../utils/getUserMedia';  // Import functions

function FaceRecognition({ onSuccess }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Function to handle image upload from file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
    } else {
      alert('Please select a valid image file.');
    }
  };

  // Start camera feed using the imported startCamera function
  const handleStartCamera = async () => {
    await startCamera(videoRef, setIsCameraActive);
  };

  // Capture image from the video feed using the imported captureImage function
  const handleCaptureImage = () => {
    captureImage(videoRef, canvasRef, setImage);
  };

  // Stop the camera feed using the imported stopCamera function
  const handleStopCamera = () => {
    stopCamera(videoRef, setIsCameraActive);
  };

  // Handle form submission (send captured image to the server)
  const handleSubmit = async () => {
    if (!image) {
      alert('Please capture or upload an image!');
      return;
    }

    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:3000/recognize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to communicate with the server');
      }

      const data = await response.json();
      console.log('Facial Recognition Result:', data);

      if (data.success && data.token) {
        const token = data.token; // Replace with actual token from backend
        onSuccess(token); // Pass the token to the parent component (App)
      } else {
        alert('Facial recognition failed!');
      }
    } catch (error) {
      console.error('Error during facial recognition:', error);
      alert('An error occurred during facial recognition.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <h2>Face Recognition</h2>

      {/* Camera Feed or Image Upload */}
      {!isCameraActive && (
        <button onClick={handleStartCamera}>Start Camera</button>
      )}
      {isCameraActive && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            width="100%"
            height="auto"
            style={{ border: '1px solid black' }}
          ></video>
          <button onClick={handleCaptureImage}>Capture Image</button>
          <button onClick={handleStopCamera}>Stop Camera</button>
        </div>
      )}

      {/* Image Upload Section */}
      <input type="file" onChange={handleImageChange} />

      {/* Show Captured or Uploaded Image */}
      {image && <img src={image} alt="Captured or Uploaded Preview" style={{ maxWidth: '100%', height: 'auto' }} />}

      {/* Submit Button */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>

      {/* Hidden canvas to draw captured image */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}

export default FaceRecognition;