/* server.js */
const express = require('express');
const cors    = require('cors');                // ① CORS-middleware
const path    = require('path');
require('dotenv').config();

const analyzeRoute = require('./routes/analyze');

const app = express();

/* === Глобальные middlewares === */
app.use(cors({ origin: '*' }));                 // ② Разрешаем всех (можно указать список доменов)
app.use(express.json());
app.use(express.static('public'));              // отдаём /public/*
app.use('/uploads', express.static('uploads')); // чтобы можно было открыть сохранённые картинки (опц.)

/* === Роут для анализа === */
app.use('/analyze', analyzeRoute);              // POST /analyze

/* === fallback для SPA (index.html) === */
app.get('*', (_req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔮 Хиромантия онлайн → http://localhost:${PORT}`)
);
