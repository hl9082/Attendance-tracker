/**
 * @author Huy Le (hl9082)
 * @description This is the main app.
 */
import React, { useState } from 'react';
import Login from './components/Login';
import Attendance from './components/Attendance';

function App() {
  const [token, setToken] = useState(null);

  return (
    <div>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <Attendance token={token} />
      )}
    </div>
  );
}

export default App;
