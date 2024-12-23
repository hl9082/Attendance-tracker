// src/components/FacialRecognition.js

import React, { useState } from 'react';

function FacialRecognition({ onSuccess }) {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('http://localhost:3000/recognize', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('Facial Recognition Result:', data);

    if (data.success) {
      const token = 'mock_token_from_face_recognition'; // Mock token from facial recognition
      onSuccess(token); // Pass the token to the parent component (App)
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleSubmit}>Submit</button>
      {image && <img src={image} alt="Uploaded Preview" />}
    </div>
  );
}

export default FacialRecognition;
