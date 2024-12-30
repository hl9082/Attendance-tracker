// src/components/Attendance.js
/**
 * @author Huy Le
 * @description attendance page
 */
import React, { useState, useEffect } from 'react';
import './Attendance.css'; // Add your custom styles

function Attendance({ token }) {
  const [attendanceList, setAttendanceList] = useState(() => {
    const savedAttendance = localStorage.getItem('attendance');
    return savedAttendance ? JSON.parse(savedAttendance) : [];
  });

  const [name, setName] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');

  useEffect(() => {
    if (!token) {
      alert('Please login to mark attendance.');
      return;  // Prevent fetching attendance if not logged in
    }

    // Fetch attendance data from the backend
    fetch('http://localhost:3000/api/attendance') // Use your Localtunnel URL
      .then((response) => response.json())
      .then((data) => setAttendanceList(data))
      .catch((error) => console.error('Error fetching attendance:', error));
  }, [token]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDateChange = (event) => {
    setAttendanceDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name && attendanceDate) {
      const newAttendance = {
        name: name,
        date: attendanceDate,
        id: Date.now(),
      };

      // Send the new attendance to the backend
      fetch('http://localhost:3000/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add token for authentication (if required)
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
          setAttendanceList((prevList) => {
            const updatedList = [...prevList, data];
            localStorage.setItem('attendance', JSON.stringify(updatedList));
            return updatedList;
          });
          setName('');
          setAttendanceDate('');
        })
        .catch((error) => {
          console.error('Error posting attendance:', error);
          alert('Error submitting attendance. Please try again later.');
        });
    } else {
      alert('Please enter valid information.');
    }
  };

  const handleDelete = (id) => {
    const updatedAttendance = attendanceList.filter((attendance) => attendance.id !== id);
    setAttendanceList(updatedAttendance);
    localStorage.setItem('attendance', JSON.stringify(updatedAttendance));
  };

const markAttendance = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/attendance/clock-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        biometricData: 'someBiometricData', // Replace this with real data
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Attendance marked:', data);
    } else {
      console.error('Failed to mark attendance:', data);
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
  }
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


