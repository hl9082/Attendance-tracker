import React, { useState } from 'react';

function FaceRecognition() {
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
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleSubmit}>Submit</button>
      <img src={image} alt="Uploaded Preview" />
    </div>
  );
}

export default FaceRecognition;
