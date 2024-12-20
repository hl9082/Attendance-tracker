import React, { useEffect, useState } from 'react';
import { fetchAttendance } from './services/api'; // Import the API function

const AttendanceList = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch attendance data when the component mounts
  useEffect(() => {
    const getAttendance = async () => {
      try {
        const data = await fetchAttendance(); // API call to fetch data
        setAttendanceData(data);
      } catch (error) {
        setError('Failed to fetch attendance data');
      } finally {
        setLoading(false);
      }
    };

    getAttendance();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Attendance List</h2>
      <ul>
        {attendanceData.map((attendance, index) => (
          <li key={index}>{attendance.name} - {attendance.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceList;
