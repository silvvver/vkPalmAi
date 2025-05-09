// server.js – «голый» API без лишнего статика
require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const analyzeRoute  = require('./routes/analyze');

const app = express();

/* ── глобальные middlewares ─────────────────────────────── */
app.use(cors({ origin: '*' }));      // если нужно – сузьте список доменов
app.use(express.json());

/* (опц.) – чтобы можно было скачать исходное фото по ссылке */
app.use('/uploads', express.static('uploads'));

/* ── основной энд-поинт ─────────────────────────────────── */
app.use('/analyze', analyzeRoute);   // POST /analyze

/* ── 404 для всего остального ───────────────────────────── */
app.all('*', (_req, res) => res.status(404).json({ error: 'Not found' }));

/* ── запуск ─────────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔮 API хироманта слушает порт ${PORT}`)
);
