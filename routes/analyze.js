// routes/analyze.js

const express = require('express');
const multer  = require('multer');
const fs      = require('fs');
const path    = require('path');
const { Configuration, OpenAIApi } = require('openai');

const upload = multer({ dest: path.resolve(__dirname, '../uploads') });
const router = express.Router();

// Настраиваем OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/', upload.single('handImage'), async (req, res) => {
  try {
    // читаем файл и кодируем в base64
    const filePath = req.file.path;
    const imageBase64 = fs.readFileSync(filePath, { encoding: 'base64' });

    // отправляем запрос в модель с поддержкой vision
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      modalities: ['text', 'vision'],
      vision: {
        images: [{ image: imageBase64 }]
      },
      messages: [
        { role: 'user', content: `Анализ ладони (стиль: ${req.body.style})` }
      ],
    });

    res.json(completion.data);
  } catch (err) {
    console.error('Error in /analyze:', err);
    res.status(500).json({ error: 'Ошибка анализа изображения' });
  }
});

module.exports = router;

