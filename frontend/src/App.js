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
  const [isFacialRecognition, setIsFacialRecognition] = useState(true); // Track facial recognition flow

    // Handle login success (this function might be triggered by the Login or FacialRecognition component)
    const handleLoginSuccess = (token) => {
      console.log("Login successful, received token:", token);
      setToken(token); // Set the token received after a successful login
    };
  
    // Trigger facial recognition flow (can be triggered from a button in Login or App)
    const handleFacialRecognitionStart = () => {
      console.log("Starting facial recognition flow");
      setIsFacialRecognition(true);
    };
  
    // Handle successful facial recognition
    const handleFacialRecognitionSuccess = (token) => {
      console.log("Facial recognition successful, received token:", token);
      setToken(token); // Facial recognition gives a token, set the token to signify login
      setIsFacialRecognition(false); // Exit facial recognition flow
    };

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


