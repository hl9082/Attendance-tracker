import React, { useState } from 'react';

const Biometric = ({ setAttendanceData }) => {
    const [fingerprintData, setFingerprintData] = useState(null);

    const handleFingerprintScan = () => {
        // Call your fingerprint library or API here
        const scanData = "sample-fingerprint-data"; // Replace with actual scan
        setFingerprintData(scanData);
        setAttendanceData(prevData => [...prevData, { id: scanData, time: new Date() }]);
    };

    return (
        <div>
            <button onClick={handleFingerprintScan}>Scan Fingerprint</button>
            {fingerprintData && <p>Fingerprint Scanned: {fingerprintData}</p>}
        </div>
    );
}

export default Biometric;