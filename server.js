// server.js  ─ единый сервис «фронт + API»
require('dotenv').config();

const path    = require('path');
const express = require('express');
const cors    = require('cors');

const analyzeRoute = require('./routes/analyze');   // ваш файл с логикой /analyze

const app = express();

/* ── глобальные middlewares ─────────────────────────────── */
app.use(cors({ origin: '*' }));     // при желании замените '*' на точные домены
app.use(express.json());

/* ── REST-API ───────────────────────────────────────────── */
app.use('/analyze', analyzeRoute);              // POST /analyze
app.use('/uploads', express.static('uploads')); // скачивание загруженных файлов

/* ── фронтенд (сборка Vite/React) ───────────────────────── */
const frontDir = path.join(__dirname, 'frontend'); // в эту папку кладёте build
app.use(express.static(frontDir, {
  /* снимаем X-Frame-Options, чтобы iframe ВК не ругался */
  setHeaders(res) {
    res.removeHeader('X-Frame-Options');
  }
}));

/* fallback для SPA: любые GET → index.html */
app.get('*', (_, res) =>
  res.sendFile(path.join(frontDir, 'index.html'))
);

/* ── запуск ─────────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔮 API хироманта слушает порт ${PORT}`);
});
