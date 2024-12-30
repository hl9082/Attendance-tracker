// src/components/Attendance.js
/**
 * @author Huy Le
 * @description attendance page
 */
import React, { useState, useEffect } from 'react';
import './Attendance.css';

function Attendance({ token }) {
  // Initial state for attendance data
  const [attendanceList, setAttendanceList] = useState([]);
  const [name, setName] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch attendance data on initial render
  useEffect(() => {
    if (!token) {
      setErrorMessage('Please login to mark attendance.');
      return;
    }

    // Fetch attendance data from the backend
    fetch('http://localhost:3000/api/attendance', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setAttendanceList(data))
      .catch((error) => {
        console.error('Error fetching attendance:', error);
        setErrorMessage('Error fetching attendance data.');
      });
  }, [token]);

  // Form input handlers
  const handleNameChange = (event) => setName(event.target.value);
  const handleDateChange = (event) => setAttendanceDate(event.target.value);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !attendanceDate) {
      setErrorMessage('Please enter valid information.');
      return;
    }

    const newAttendance = { name, date: attendanceDate };

    // Send the new attendance to the backend
    fetch('http://localhost:3000/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,  // Send token for authentication
      },
      body: JSON.stringify(newAttendance),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to post attendance');
        }
        return response.json();
      })
      .then((data) => {
        // Add the new attendance to the state
        setAttendanceList((prevList) => {
          const updatedList = [...prevList, data];
          return updatedList;  // Update the list with the new attendance
        });
        setName('');
        setAttendanceDate('');
        setErrorMessage('');  // Clear any error messages
      })
      .catch((error) => {
        console.error('Error posting attendance:', error);
        setErrorMessage('Error submitting attendance. Please try again later.');
      });
  };

  // Handle delete operation
  const handleDelete = (id) => {
    const updatedAttendance = attendanceList.filter((attendance) => attendance.id !== id);
    setAttendanceList(updatedAttendance);
  };

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">Mark Attendance</h2>
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form className="attendance-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter Name"
          className="attendance-input"
          required
        />
        <input
          type="date"
          value={attendanceDate}
          onChange={handleDateChange}
          className="attendance-input"
          required
        />
        <button type="submit" className="attendance-button">
          Mark Attendance
        </button>
      </form>

      <h3 className="attendance-list-title">Attendance Records:</h3>
      <ul className="attendance-list">
        {attendanceList.length === 0 ? (
          <li>No attendance records yet.</li>
        ) : (
          attendanceList.map((attendance) => (
            <li key={attendance.id} className="attendance-item">
              <span>{attendance.name} - {attendance.date}</span>
              <button
                className="delete-button"
                onClick={() => handleDelete(attendance.id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Attendance;
