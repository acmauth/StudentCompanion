// server.js
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/proxy', async (req, res) => {
    try {
        const targetURL = req.query.url;
        const response = await axios.get(targetURL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from the target website' });
    }
});

app.listen(port, () => {
    console.log(`Express server is running on http://localhost:${port}`);
});
