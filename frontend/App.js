import React, { useState } from 'react';
import Attendance from './Attendance';
import Biometric from './Biometric';

const App = () => {
    const [attendanceData, setAttendanceData] = useState([]);

    return (
        <div>
            <h1>Attendance Tracking</h1>
            <Biometric setAttendanceData={setAttendanceData} />
            <Attendance data={attendanceData} />
        </div>
    );
}

export default App;