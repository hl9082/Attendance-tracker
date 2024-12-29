// src/components/Attendance.js
/**
 * @author Huy Le
 * @description attendance page
 */
import React, { useState, useEffect } from 'react';
import './Attendance.css'; // Add your custom styles

function Attendance({ token }) {
  // Initialize state for attendance list from localStorage or an empty array
  const [attendanceList, setAttendanceList] = useState(() => {
    const savedAttendance = localStorage.getItem('attendance');
    return savedAttendance ? JSON.parse(savedAttendance) : [];
  });

  const [name, setName] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');

    // UseEffect to react to token changes (for example, you might want to fetch something when token changes)
  useEffect(() => {
    if (!token) {
      alert('Please login to mark attendance.');
    }

     // Fetch attendance data from the backend (use your Localtunnel URL here)
    fetch('https://questionmark.loca.lt/api/attendance') // Replace with your Localtunnel URL
      .then((response) => response.json())
      .then((data) => setAttendanceList(data))
      .catch((error) => console.error('Error fetching attendance:', error));

  }, [token]); // Dependency on token - runs only when token changes

  // Handle name input change
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  // Handle date input change
  const handleDateChange = (event) => {
    setAttendanceDate(event.target.value);
  };

  // Submit the new attendance record
  const handleSubmit = (event) => {
    event.preventDefault();
    if (name && attendanceDate) {
      const newAttendance = {
        name: name,
        date: attendanceDate,
        id: Date.now(),
      };

      // Send the new attendance to the backend
      fetch('https://questionmark.loca.lt/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add token for authentication (if required)
        },
        body: JSON.stringify(newAttendance),
      })
        .then((response) => response.json())
        .then((data) => {
          // Add the new attendance to the local state and localStorage
          setAttendanceList((prevList) => [...prevList, data]);
          localStorage.setItem('attendance', JSON.stringify([...attendanceList, data]));

          // Clear input fields
          setName('');
          setAttendanceDate('');
        })
        .catch((error) => console.error('Error posting attendance:', error));
    } else {
      alert('Please enter valid information.');
    }
  };

  


  // Delete an attendance record
  const handleDelete = (id) => {
    const updatedAttendance = attendanceList.filter((attendance) => attendance.id !== id);
    setAttendanceList(updatedAttendance);

    // Persist updated attendance to localStorage
    localStorage.setItem('attendance', JSON.stringify(updatedAttendance));
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

