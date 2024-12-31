import React, { useState, useRef } from 'react';
import axios from 'axios';
import "./App.css";

const App = () => {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [transcription, setTranscription] = useState("");
    const [notes, setNotes] = useState("");
    const [finalDisplay, setFinalDisplay] = useState("");
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleRecord = async () => {
        if (!recording) {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;

                mediaRecorder.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setAudioURL(audioUrl);

                    // Send audio to backend
                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'recordedAudio.wav');

                    try {
                        const response = await axios.post('http://localhost:8080/upload', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        const transcriptionResponse = response.data.transcription || "";
                        setTranscription(transcriptionResponse);
                        setFinalDisplay(
                            `Transcription:\n${transcriptionResponse}\n\nNotes:\n${notes}`
                        );
                    } catch (err) {
                        console.error('Error uploading audio:', err);
                    }

                    audioChunksRef.current = []; // Reset chunks
                };

                mediaRecorder.start();
                setRecording(true);
                console.log("Recording started...");
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Could not access the microphone. Please allow microphone access.");
            }
        } else {
            // Stop recording
            mediaRecorderRef.current.stop();
            setRecording(false);
            console.log("Recording stopped...");
        }
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
            {audioURL && (
                <div className="audioPlayback">
                    <h3>Recorded Audio:</h3>
                    <audio controls src={audioURL}></audio>
                </div>
            )}
            <textarea
                className="notesField"
                placeholder="Add notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            ></textarea>
            {finalDisplay && (
                <div className="finalDisplay">
                    <h3>Final Display:</h3>
                    <pre>{finalDisplay}</pre>
                </div>
            )}
        </>
    );
};

export default App;
