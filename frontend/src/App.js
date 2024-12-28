/**
 * @author Huy Le (hl9082)
 * @description This is the main app.
 */
// src/App.js

import React, { useState } from 'react';
import Login from './components/Login'; // Assuming Login is in components folder
import FacialRecognition from './components/FaceRecognition'; // Assuming FacialRecognition is in components folder
import Attendance from './components/Attendance'; // Assuming Attendance is in components folder
import VoiceRecognition from './components/VoiceRecognition'; // Add VoiceRecognition component
import FingerprintRecognition from './components/FingerprintRecognition'; // Add FingerprintRecognition component

function App() {
  const [token, setToken] = useState(null); // Token to track logged-in status
  const [isFacialRecognition, setIsFacialRecognition] = useState(false); // Track facial recognition flow
  const [isVoiceRecognition, setIsVoiceRecognition] = useState(false); // Track voice recognition flow
  const [isFingerprintRecognition, setIsFingerprintRecognition] = useState(false); // Track fingerprint recognition flow

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

  const handleVoiceRecognitionSuccess = (voiceData) => {
    console.log("Voice Recognition successful, received data:", voiceData);
    // Here, you would send the voice data to the backend for authentication
    setToken('mockTokenFromVoice'); // Mock token for testing
  };

  const handleFingerprintRecognitionSuccess = (fingerprintData) => {
    console.log("Fingerprint Recognition successful, received data:", fingerprintData);
    // Here, you would send the fingerprint data to the backend for authentication
    setToken('mockTokenFromFingerprint'); // Mock token for testing
  };

  return (
    <div className="App">
      <h1>Attendance System</h1>

      {!token && !isFacialRecognition && !isVoiceRecognition && !isFingerprintRecognition && (
        <div>
          <h2>Login with Credentials</h2>
          <Login setToken={handleLoginSuccess} />
          <p>OR</p>
          <button onClick={handleFacialRecognitionStart}>Login with Facial Recognition</button>
          <button onClick={() => setIsVoiceRecognition(true)}>Login with Voice Recognition</button>
          <button onClick={() => setIsFingerprintRecognition(true)}>Login with Fingerprint Recognition</button>
        </div>
      )}

      {isFacialRecognition && (
        <div>
          <h2>Facial Recognition</h2>
          <FacialRecognition onSuccess={handleFacialRecognitionSuccess} />
        </div>
      )}

      {isVoiceRecognition && (
        <VoiceRecognition onVoiceSuccess={handleVoiceRecognitionSuccess} />
      )}

      {isFingerprintRecognition && (
        <FingerprintRecognition onFingerprintSuccess={handleFingerprintRecognitionSuccess} />
      )}

      {token && !isFacialRecognition && !isVoiceRecognition && !isFingerprintRecognition && (
        <div>
          <h2>Welcome, You are logged in!</h2>
          <Attendance token={token} />
        </div>
      )}
    </div>
  );
}

export default App;




