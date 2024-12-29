// src/utils/getUserMedia.js

export const startCamera = async (videoRef, setIsCameraActive) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' }, // Front-facing camera
    });
    videoRef.current.srcObject = stream;
    setIsCameraActive(true);
  } catch (err) {
    console.error('Error accessing camera:', err);
    if (err.name === 'NotFoundError') {
      alert('No camera found. Please ensure your device has a camera connected.');
    } else if (err.name === 'NotAllowedError') {
      alert('Permission denied. Please allow camera access in your browser.');
    } else if (err.name === 'NotReadableError') {
      alert('Camera is being used by another application. Please close it and try again.');
    } else {
      alert('An unknown error occurred while accessing the camera.');
    }
  }
};

export const stopCamera = (videoRef, setIsCameraActive) => {
  if (videoRef.current && videoRef.current.srcObject) {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
  }
  setIsCameraActive(false);
};

export const captureImage = (videoRef, canvasRef, setImage) => {
  if (videoRef.current && canvasRef.current) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const capturedImage = canvas.toDataURL('image/jpeg');
    setImage(capturedImage);
  }
};
