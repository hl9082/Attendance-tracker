// src/components/Login.js
/**
 * @author Huy Le (hl9082)
 * @description login page.
 */
// src/components/Login.js

// frontend/src/components/Login.js
import React, { useState } from 'react';

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email && password) {
      const credentials = { email, password };

      fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            setToken(data.token);  // Store the token in the parent component
            alert('Login successful');
          } else {
            alert('Invalid credentials');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Error logging in. Please try again.');
        });
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

