// src/components/FacialRecognition.js

import React, { useState } from 'react';

function FaceRecognition({ onSuccess }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
    } else {
      alert('Please select a valid image file.');
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert('Please upload an image!');
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
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
      {image && <img src={image} alt="Uploaded Preview" style={{ maxWidth: '100%', height: 'auto' }} />}
    </div>
  );
}

export default FaceRecognition;
