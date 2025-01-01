# consultation-app

A web application designed for doctors to record, transcribe, and take notes during patient consultations. This app allows the doctor to easily capture audio recordings, transcribe them into text, and combine the transcriptions with handwritten notes for a complete consultation summary.

## Features
- Record and Pause Audio: Allows doctors to start, pause, and resume recording during consultations.
- Transcription: Automatically transcribe recorded audio into text using Google Cloud Speech-to-Text API.
- Notes Section: Provides a field to add additional notes during the consultation.
- Consultation Summary: Displays a summary of the consultation, combining transcription and any notes written during the session.
- Edit Summary: Option to edit the consultation summary after it's displayed.

## Tech Stack
- Frontend: React.js
- Backend: Node.js, Express.js
- Transcription API: Google Cloud Speech-to-Text API
- Styling: CSS (Custom styles)
- Audio Processing: ffmpeg for audio file conversion (Mono channel)
- Version Control: Git

## Installation

Prerequisites
Node.js: You’ll need Node.js and npm installed on your machine.
Google Cloud Account: You’ll need a Google Cloud account with access to the Speech-to-Text API. Set up the necessary credentials and save them in a .env file.

## Steps to Set Up Locally
1. Clone this repository: 
    git clone https://github.com/Jaydenlaoyx/consultation-app

2. Install the required dependencies for both the frontend and backend:
    cd consultation-app
    npm install

3. Create a .env file in the root directory and add your Google Cloud credentials:
    GOOGLE_APPLICATION_CREDENTIALS=<path-to-your-google-credentials-file>

4. Start the backend server:
    node backend/index.js (do this at the root directory of project)

5. Start the React development server:
    npm start

6. Open the application in your browser (http://localhost:3000).

## Usage
1. Start a New Consultation: Click "Start Recording" to begin recording the consultation.
2. Pause/Resume Recording: The recording can be paused and resumed as needed.
3. Stop Recording: Once the consultation is complete, click "Stop Recording".
4. Finish Consultation: After stopping the recording, click "Finish Consultation" to view the transcription and notes.
5. Edit Summary: You can edit the summary before saving it.
6. New Consultation: After saving or editing the summary, click "New Consultation" to start a fresh recording.


## Acknowledgements
Google Cloud Speech-to-Text API: For transcribing the recorded audio.
React.js: For building the frontend.
ffmpeg: For audio file processing.
Node.js and Express: For the backend.

