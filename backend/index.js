const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (req, res) => {
    res.send({ status: 'OK' });
});

app.get('/', (req, res) => {
    res.send({status: "Welcome to the consultation app"});
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
