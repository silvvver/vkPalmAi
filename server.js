// server.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const analyzeRoute = require('./routes/analyze');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/analyze', analyzeRoute);
app.all('*', (_req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔮 API хироманта слушает порт ${PORT}`));
