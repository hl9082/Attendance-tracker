import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // URL of your backend

// Function to fetch attendance data
export const fetchAttendance = async () => {
  try {
    const response = await axios.get(`${API_URL}/attendance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw error;
  }
};

// Function to submit attendance data
export const submitAttendance = async (attendanceData) => {
  try {
    const response = await axios.post(`${API_URL}/attendance`, attendanceData);
    return response.data;
  } catch (error) {
    console.error('Error submitting attendance data:', error);
    throw error;
  }
};