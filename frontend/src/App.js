/**
 * @author Huy Le (hl9082)
 * @description This is the main app.
 */
// src/App.js

import React, { useState } from 'react';
import Login from './components/Login'; // Assuming Login is in components folder
import Register from './components/Register'; // Assuming Register is in components folder
import FacialRecognition from './components/FaceRecognition'; // Assuming FacialRecognition is in components folder
import Attendance from './components/Attendance'; // Assuming Attendance is in components folder
import VoiceRecognition from './components/VoiceRecognition'; // Add VoiceRecognition component
import FingerprintRecognition from './components/FingerprintRecognition'; // Add FingerprintRecognition component

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null); // Token to track logged-in status
  const [isFacialRecognition, setIsFacialRecognition] = useState(false); // Track facial recognition flow
  const [isVoiceRecognition, setIsVoiceRecognition] = useState(false); // Track voice recognition flow
  const [isFingerprintRecognition, setIsFingerprintRecognition] = useState(false); // Track fingerprint recognition flow
  const [isRegistering, setIsRegistering] = useState(false); // Track if the user is in the registration flow

  // Handle successful login (via credentials)
  const handleLoginSuccess = (token) => {
    console.log("Login successful, received token:", token);
    setToken(token);
    localStorage.setItem('token', token); // Save token in localStorage
  };

  // Handle starting facial recognition flow
  const handleFacialRecognitionStart = () => {
    console.log("Starting facial recognition flow");
    setIsFacialRecognition(true);
  };

  // Handle successful facial recognition
  const handleFacialRecognitionSuccess = (token) => {
    console.log("Facial recognition successful, received token:", token);
    setToken(token);
    localStorage.setItem('token', token); // Save token in localStorage
    setIsFacialRecognition(false); // Close facial recognition flow
  };

  // Handle successful voice recognition
  const handleVoiceRecognitionSuccess = (voiceData) => {
    console.log("Voice recognition successful, received data:", voiceData);
    // Here, you would send the voice data to the backend for authentication
    setToken('mockTokenFromVoice'); // Mock token for testing
    localStorage.setItem('token', 'mockTokenFromVoice'); // Save mock token for testing
  };

  // Handle successful fingerprint recognition
  const handleFingerprintRecognitionSuccess = (fingerprintData) => {
    console.log("Fingerprint recognition successful, received data:", fingerprintData);
    // Here, you would send the fingerprint data to the backend for authentication
    setToken('mockTokenFromFingerprint'); // Mock token for testing
    localStorage.setItem('token', 'mockTokenFromFingerprint'); // Save mock token for testing
  };

  return (
    <div className="App">
      <h1>Attendance System</h1>

      {/* Conditional rendering for Registration/Login */}
      {!token && !isFacialRecognition && !isVoiceRecognition && !isFingerprintRecognition && (
        <div>
          {!isRegistering ? (
            <div>
              <h2>Login with Credentials</h2>
              <Login setToken={handleLoginSuccess} />
              <p>OR</p>
              <button onClick={() => setIsRegistering(true)}>Register Instead</button>
              <button onClick={handleFacialRecognitionStart}>Login with Facial Recognition</button>
              <button onClick={() => setIsVoiceRecognition(true)}>Login with Voice Recognition</button>
              <button onClick={() => setIsFingerprintRecognition(true)}>Login with Fingerprint Recognition</button>
            </div>
          ) : (
            <div>
              <h2>Register a New Account</h2>
              <Register setToken={handleLoginSuccess} />
              <p>OR</p>
              <button onClick={() => setIsRegistering(false)}>Already have an account? Login</button>
            </div>
          )}
        </div>
      )}

      {/* Facial Recognition Flow */}
      {isFacialRecognition && (
        <div>
          <h2>Facial Recognition</h2>
          <FacialRecognition onSuccess={handleFacialRecognitionSuccess} />
        </div>
      )}

      {/* Voice Recognition Flow */}
      {isVoiceRecognition && (
        <VoiceRecognition onVoiceSuccess={handleVoiceRecognitionSuccess} />
      )}

      {/* Fingerprint Recognition Flow */}
      {isFingerprintRecognition && (
        <FingerprintRecognition onFingerprintSuccess={handleFingerprintRecognitionSuccess} />
      )}

      {/* Attendance after successful login */}
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
