// server.js — единый сервис «фронт + API»
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const analyzeRoute = require('./routes/analyze');

const app = express();

/* ── глобальные middlewares ─────────────────────────────── */
app.use(cors({ origin: '*' })); // при желании укажите точные домены
app.use(express.json());

/* ── API ────────────────────────────────────────────────── */
app.use('/analyze', analyzeRoute);          // POST /analyze
app.use('/uploads', express.static('uploads')); // выдаём загруженные файлы

/* ── фронтенд (сборка Vite/React) ───────────────────────── */
const staticDir = path.join(__dirname, 'frontend');
app.use(express.static(staticDir));         // /assets/… и index.html

// fallback: всё, что не API и не /uploads, отдаём index.html
app.get('*', (_req, res) =>
  res.sendFile(path.join(staticDir, 'index.html'))
);

/* ── запуск ─────────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔮 API хироманта слушает порт ${PORT}`)
);

