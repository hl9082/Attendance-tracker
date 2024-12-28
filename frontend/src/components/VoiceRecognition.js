// src/components/VoiceRecognition.js
import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceRecognition = ({ onVoiceSuccess }) => {
  const [isListening, setIsListening] = useState(false);

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      console.log('Transcript:', transcript);
      onVoiceSuccess(transcript); // Callback to pass the recognized voice to the parent component
    }
  }, [transcript, onVoiceSuccess]);

  const startListening = () => {
    SpeechRecognition.startListening();
    setIsListening(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  return (
    <div>
      <h2>Voice Recognition</h2>
      {!listening && (
        <button onClick={startListening}>
          Start Listening
        </button>
      )}
      {listening && (
        <button onClick={stopListening}>
          Stop Listening
        </button>
      )}
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default VoiceRecognition;
