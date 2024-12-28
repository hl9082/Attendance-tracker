// src/components/VoiceRecognition.js
import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceRecognition = ({ onVoiceSuccess }) => {
  // Remove `isListening` as `listening` is already provided by the library
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening();
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  // Use useEffect to call `onVoiceSuccess` when the transcript is updated
  useEffect(() => {
    if (transcript) {
      console.log('Transcript:', transcript);
      onVoiceSuccess(transcript); // Pass the transcript to the parent component
    }
  }, [transcript, onVoiceSuccess]);

  const handleClearTranscript = () => {
    resetTranscript();
  };

  return (
    <div>
      <h2>Voice Recognition</h2>
      {!listening && (
        <button onClick={startListening}>Start Listening</button>
      )}
      {listening && (
        <button onClick={stopListening}>Stop Listening</button>
      )}
      <p>Transcript: {transcript}</p>
      <button onClick={handleClearTranscript}>Clear Transcript</button>
    </div>
  );
};

export default VoiceRecognition;
