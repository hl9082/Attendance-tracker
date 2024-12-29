// src/components/FacialRecognition.js

import React, { useState, useRef } from 'react';

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

  // Start camera feed
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }, // Front-facing camera
      });
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access the camera.');
    }
  };

  // Capture an image from the video feed
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const capturedImage = canvas.toDataURL('image/jpeg');
      setImage(capturedImage);
    }
  };

  // Stop the camera feed
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraActive(false);
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
        <button onClick={startCamera}>Start Camera</button>
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
          <button onClick={captureImage}>Capture Image</button>
          <button onClick={stopCamera}>Stop Camera</button>
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
