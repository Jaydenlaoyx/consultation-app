import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import "./App.css";

const App = () => {
    const [recording, setRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [transcription, setTranscription] = useState("");
    const [notes, setNotes] = useState("");
    const [summaryEditable, setSummaryEditable] = useState(false);
    const [sessionFinished, setSessionFinished] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    const doctorName = "Dr. Jane Doe"; // Simulated doctor account name

    const handleRecord = async () => {
        if (!recording) {
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

                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'recordedAudio.wav');

                    try {
                        const response = await axios.post('http://localhost:8080/upload', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        setTranscription(response.data.transcription || "No transcription available.");
                    } catch (err) {
                        console.error('Error uploading audio:', err);
                    }

                    audioChunksRef.current = [];
                };

                mediaRecorder.start();
                setRecording(true);
                setPaused(false);
                startTimer();
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Could not access the microphone. Please allow microphone access.");
            }
        } else if (paused) {
            mediaRecorderRef.current.resume();
            setPaused(false);
            startTimer();
        } else {
            mediaRecorderRef.current.pause();
            setPaused(true);
            stopTimer();
        }
    };

    const handleStop = () => {
        if (recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
            setPaused(false);
            stopTimer();
        }
    };

    const handleFinishSession = () => {
        setSessionFinished(true);
    };

    const handleEditSummary = () => {
        setSummaryEditable(true);
    };

    const handleSaveSummary = () => {
        setSummaryEditable(false);
    };

    const handleNewConsultation = () => {
        setSessionFinished(false);
        setRecording(false);
        setPaused(false);
        setAudioURL(null);
        setTranscription("");
        setNotes("");
        setRecordingTime(0);
    };

    const startTimer = () => {
        if (!timerRef.current) {
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        }
    };

    const stopTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div className="container">
            <div className="navbar">
                <div className="brand">ConsultationApp</div>
                <div className="nav-links">
                    <a href="#consultations">Consultations</a>
                    <a href="#patients">Patients</a>
                    <a href="#settings">Settings</a>
                </div>
                <div className="user-account">{doctorName}</div>
            </div>

            {sessionFinished ? (
                <div className="summaryPage">
                    <h2>Consultation Summary</h2>
                    <div className="finalDisplay">
                        <h3>Transcription:</h3>
                        {summaryEditable ? (
                            <textarea
                                className="editableText"
                                value={transcription}
                                onChange={(e) => setTranscription(e.target.value)}
                            ></textarea>
                        ) : (
                            <pre>{transcription}</pre>
                        )}
                        <h3>Notes:</h3>
                        {summaryEditable ? (
                            <textarea
                                className="editableText"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        ) : (
                            <pre>{notes || "No additional notes provided."}</pre>
                        )}
                    </div>
                    <div className="buttonsContainer">
                        {summaryEditable ? (
                            <button className="saveButton" onClick={handleSaveSummary}>
                                Save Summary
                            </button>
                        ) : (
                            <button className="editButton" onClick={handleEditSummary}>
                                Edit Summary
                            </button>
                        )}
                        <button className="newConsultationButton" onClick={handleNewConsultation}>
                            New Consultation
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h2>Consultation Recording</h2>
                    <div className="patientInfoSection">
                        <h3>Patient Details</h3>
                        <p>Name: John Apples</p>
                        <p>Date of Birth: 12/02/1992</p>
                        <p>Gender: Male</p>
                    </div>
                    <div className="recordButtonsContainer">
                        <button onClick={handleRecord}>
                            {recording && !paused ? "Pause Recording" : recording ? "Resume Recording" : "Start Recording"}
                        </button>
                        {recording && <button onClick={handleStop}>Stop Recording</button>}
                        {(recording || paused) && (
                            <div className="recordingDuration">
                                Recording Duration: {Math.floor(recordingTime / 60)}:
                                {("0" + (recordingTime % 60)).slice(-2)} (mm:ss)
                            </div>
                        )}
                    </div>
                    <div className="notesSection">
                        <h3>Notes</h3>
                        <textarea
                            className="notesField"
                            placeholder="Add notes here..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        ></textarea>
                    </div>
                    {audioURL && (
                        <div className="audioPlayback">
                            <h3>Recorded Audio:</h3>
                            <audio controls src={audioURL}></audio>
                        </div>
                    )}
                    <div className="finishSessionContainer">
                        <button
                            onClick={handleFinishSession}
                            disabled={!transcription && !notes}
                        >
                            Finish Consultation
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
