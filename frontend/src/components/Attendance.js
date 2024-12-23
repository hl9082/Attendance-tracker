// src/components/Attendance.js
/**
 * @author Huy Le
 * @description attendance page
 */
import React from 'react';

const Attendance = ({ token }) => {
  return (
    <div>
      <h1>Attendance Page</h1>
      <p>Authenticated with token: {token}</p>
    </div>
  );
};

export default Attendance;
