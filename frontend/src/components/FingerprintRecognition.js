// src/components/FingerprintRecognition.js
import React, { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const FingerprintRecognition = ({ onFingerprintSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [fingerprint, setFingerprint] = useState('');

  // UseEffect to trigger fingerprint scan once the scan has started
  useEffect(() => {
    const getFingerprint = async () => {
      if (isScanning) {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprint(result.visitorId); // Simulate fingerprint ID
        onFingerprintSuccess(result.visitorId); // Pass the result to parent component
        setIsScanning(false); // Stop scanning after fingerprint is retrieved
      }
    };

    getFingerprint();
  }, [isScanning, onFingerprintSuccess]); // Run effect only when scanning starts

  const startFingerprintScan = () => {
    setIsScanning(true); // This triggers the useEffect above
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
