// src/components/Login.js
/**
 * @author Huy Le (hl9082)
 * @description login page.
 */
// src/components/Login.js

import React, { useState } from 'react';

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you'd typically make an API request to verify credentials
    const token = 'mock_token_from_login'; // Mock token from a successful login
    setToken(token); // Pass the token to the parent component (App)
  };

  return (
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
  );
}

export default Login;
