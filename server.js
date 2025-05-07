/* server.js */
const express = require('express');
const path    = require('path');
require('dotenv').config();

const analyzeRoute = require('./routes/analyze');

const app = express();
app.use(express.static('public'));   // раздаём static

app.use('/', analyzeRoute);          // POST /analyze

app.get('/', (_req,res) =>
  res.sendFile(path.join(__dirname,'public','index.html'))
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔮 Хиромантия онлайн → http://localhost:${PORT}`)
);

