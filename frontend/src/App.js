/**
 * @author Huy Le (hl9082)
 * @description This is the main app.
 */
// src/App.js

import React, { useState } from 'react';
import Login from './components/Login'; // Assuming Login is in components folder
import FacialRecognition from './components/FaceRecognition'; // Assuming FacialRecognition is in components folder
import Attendance from './components/Attendance'; // Assuming Attendance is in components folder


function App() {
  const [token, setToken] = useState(null); // Token to track logged-in status
  const [isFacialRecognition, setIsFacialRecognition] = useState(false); // Track facial recognition flow

  const handleLoginSuccess = (token) => {
    console.log("Login successful, received token:", token);
    setToken(token);
  };

  const handleFacialRecognitionStart = () => {
    console.log("Starting facial recognition flow");
    setIsFacialRecognition(true);
  };

  const handleFacialRecognitionSuccess = (token) => {
    console.log("Facial recognition successful, received token:", token);
    setToken(token);
    setIsFacialRecognition(false);
  };

  console.log('App component rendering...'); // Add this log to see if App is rendering.

  return (
    <div className="App">
      <h1>Attendance System</h1>
      <div>Static content to test rendering.</div>

      {!token && !isFacialRecognition && (
        <div>
          <h2>Login with Credentials</h2>
          <Login setToken={handleLoginSuccess} />
          <p>OR</p>
          <button onClick={handleFacialRecognitionStart}>Login with Facial Recognition</button>
        </div>
      )}

      {isFacialRecognition && (
        <div>
          <h2>Facial Recognition</h2>
          <FacialRecognition onSuccess={handleFacialRecognitionSuccess} />
        </div>
      )}

      {token && !isFacialRecognition && (
        <div>
          <h2>Welcome, You are logged in!</h2>
          <Attendance token={token} />
        </div>
      )}
    </div>
  );
}

export default App;



