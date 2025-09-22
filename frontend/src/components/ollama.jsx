import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const VoiceAssistant = () => {
  const [responses, setResponses] = useState([]);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    if (transcript) {
      const speech = new SpeechSynthesisUtterance(transcript);
      window.speechSynthesis.speak(speech);
      setResponses([...responses, transcript]);
      resetTranscript();
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div>
        <button
          onMouseDown={startListening}
          onMouseUp={stopListening}
          style={{
            background: listening ? "red" : "#007bff",
            border: "none",
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          🎤
        </button>
        <p>{listening ? "Listening..." : "Click and hold to speak"}</p>
      </div>
      <div>
        <h2>Conversation:</h2>
        <ul>
          {responses.map((response, index) => (
            <li key={index}>{response}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoiceAssistant;
