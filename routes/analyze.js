// routes/analyze.js
const express = require('express');
const multer  = require('multer');
const fs      = require('fs');
const path    = require('path');
const OpenAI  = require('openai');

// Правильный импорт Configuration/Api из CJS
const configuration = new OpenAI.Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAI.OpenAIApi(configuration);

// Сохраняем картинки в /uploads
const upload = multer({ dest: path.resolve(__dirname, '../uploads/') });

const router = express.Router();

router.post('/', upload.single('handImage'), async (req, res) => {
  try {
    // читаем файл и конвертим в base64
    const img = fs.readFileSync(req.file.path).toString('base64');

    // отправляем в GPT-4o-mini для анализа с картинками
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      modalities: ['text', 'vision'],
      vision: { images: [{ image: img }] },
      messages: [
        { role: 'user', content: `Анализ ладони (стиль: ${req.body.style})` }
      ],
    });

    res.json(completion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка анализа изображения' });
  }
});

module.exports = router;
