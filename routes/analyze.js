// routes/analyze.js
const express = require('express');
const multer  = require('multer');
const fs      = require('fs');
const { Configuration, OpenAIApi } = require('openai');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/', upload.single('handImage'), async (req, res) => {
  try {
    const imageData = fs.readFileSync(req.file.path);
    // ... здесь ваш код для запроса в OpenAI ...
    // const response = await openai.createImageAnalysis({...})
    res.json({ /* результат */ });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка анализа изображения' });
  } finally {
    fs.unlinkSync(req.file.path);
  }
});

module.exports = router;
