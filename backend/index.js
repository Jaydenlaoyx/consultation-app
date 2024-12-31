const express = require('express');
const cors = require('cors');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const app = express();
const PORT = process.env.PORT || 8080;

async function main() {
    const client = new speech.SpeechClient();
    const filename = '/Users/jaydenlao/Desktop/react_playground/consultation-app/resources/sampleAudio.wav';

    // convert audio to mono channel 
    ffmpeg(filename).audioChannels(1).save('/Users/jaydenlao/Desktop/react_playground/consultation-app/resources/output.wav').on('end', () => {
    console.log('Conversion to mono completed');}).on('error', (err) => {console.error('Error:', err.message);});

    const monoFilename = '/Users/jaydenlao/Desktop/react_playground/consultation-app/resources/output.wav';
    const file = fs.readFileSync(monoFilename);
    const audioBytes = file.toString('base64');

    const audio = {
        content: audioBytes
    };

    const config = {
        encoding: 'LINEAR16',
        //sampleRateHertz: 16000,
        languageCode: 'en-US'
    };

    const request = {
        audio: audio,
        config: config
    };

    const [response] = await client.recognize(request);
    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
    console.log(`Transcription: ${transcription}`);
}
main().catch(console.error);

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (req, res) => {
    res.send({ status: 'OK' });
});

app.get('/', (req, res) => {
    res.send({status: "Welcome to the consultation app"});
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
