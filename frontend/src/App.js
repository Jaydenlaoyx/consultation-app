import React, { useState } from 'react';
import "./App.css";
// import axios from 'axios';

const App = () => {
    const [recording, setRecording] = useState(false);
    // const [transcript, setTranscript] = useState("");

    const handleRecord = () => {
        setRecording(!recording);
        // Logic for recording will go here.
    };

    return (
        <>
          <div className="patientInfoSection">
            <p className="patientInfoRow">Name: John Apples</p>
            <p className="patientInfoRow">Date of Birth: 12/02/1992</p>
            <p className="patientInfoRow">Gender: Male</p>
          </div>
          <div className="recordButtonsContainer">
          <button className="recordButton" onClick={handleRecord}>
                {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
            <textarea className="notesField" placeholder="Add notes here..."></textarea>
            {/* <span className="transcript"></span> */}
        </>
    );
};

export default App;
