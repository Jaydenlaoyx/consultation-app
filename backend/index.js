require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const cors = require('cors');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Set up Multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint to handle audio upload and transcription
app.post('/upload', upload.single('audio'), async (req, res) => {
    try {
        const uploadedFilePath = req.file.path;
        const monoFilePath = `${uploadedFilePath}-mono.wav`;

        // Convert audio to mono
        await new Promise((resolve, reject) => {
            ffmpeg(uploadedFilePath)
                .audioChannels(1)
                .save(monoFilePath)
                .on('end', resolve)
                .on('error', reject);
        });

        // Transcribe the audio
        const client = new speech.SpeechClient({
            keyFilename: process.env.CLOUD_APPLICATION_CREDENTIALS,
        });
        const audioBytes = fs.readFileSync(monoFilePath).toString('base64');

        const request = {
            audio: { content: audioBytes },
            config: {
                encoding: 'LINEAR16',
                languageCode: 'en-US',
            },
        };

        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        // Clean up uploaded files
        fs.unlinkSync(uploadedFilePath);
        fs.unlinkSync(monoFilePath);

        res.json({ transcription });
    } catch (err) {
        console.error('Error processing audio:', err);
        res.status(500).send('Error processing audio');
    }
});

app.get('/', (req, res) => {
    res.send({ status: "Welcome to the consultation app" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
