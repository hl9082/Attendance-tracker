// src/components/FingerprintRecognition.js
import React, { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const FingerprintRecognition = ({ onFingerprintSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [fingerprint, setFingerprint] = useState('');

  const startFingerprintScan = async () => {
    setIsScanning(true);
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    setFingerprint(result.visitorId); // Simulate fingerprint ID
    onFingerprintSuccess(result.visitorId); // Callback to pass the fingerprint ID to the parent
    setIsScanning(false);
  };

  return (
    <div>
      <h2>Fingerprint Recognition</h2>
      {!isScanning && (
        <button onClick={startFingerprintScan}>
          Start Fingerprint Scan
        </button>
      )}
      {isScanning && <p>Scanning...</p>}
      {fingerprint && <p>Fingerprint ID: {fingerprint}</p>}
    </div>
  );
};

export default FingerprintRecognition;
