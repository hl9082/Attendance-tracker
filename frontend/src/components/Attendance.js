// src/components/Attendance.js
/**
 * @author Huy Le
 * @description attendance page
 */
import React, { useState } from 'react';
import './Attendance.css'; // Add your custom styles

function Attendance({ token }) {
  const [name, setName] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [attendanceList, setAttendanceList] = useState([]); // Only save the local list of attendance
  const [errorMessage, setErrorMessage] = useState(''); // To show any error messages

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDateChange = (event) => {
    setAttendanceDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !attendanceDate) {
      setErrorMessage('Please enter valid information.');
      return;
    }

    const newAttendance = { name, date: attendanceDate };

    // Send the new attendance to the backend (without fetching the list)
    fetch('http://localhost:3000/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Ensure the token is passed for authentication
      },
      body: JSON.stringify(newAttendance),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setErrorMessage(data.message); // Handle backend errors (e.g., invalid data)
        } else {
          // Update local state with new attendance record
          setAttendanceList((prevList) => [...prevList, data]);
          setName(''); // Clear name input field
          setAttendanceDate(''); // Clear date input field
          setErrorMessage(''); // Clear error message
        }
      })
      .catch((error) => {
        console.error('Error posting attendance:', error);
        setErrorMessage('Error submitting attendance. Please try again later.');
      });
  };

  const handleDelete = (id) => {
    const updatedAttendance = attendanceList.filter((attendance) => attendance.id !== id);
    setAttendanceList(updatedAttendance);
  };

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">Mark Attendance</h2>

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

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <h3 className="attendance-list-title">Attendance Records:</h3>
      <ul className="attendance-list">
        {attendanceList.map((attendance) => (
          <li key={attendance.id} className="attendance-item">
            <span>{attendance.name} - {attendance.date}</span>
            <button
              className="delete-button"
              onClick={() => handleDelete(attendance.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Attendance;
