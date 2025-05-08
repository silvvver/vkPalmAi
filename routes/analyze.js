// routes/analyze.js
const express  = require('express');
const multer   = require('multer');
const fs       = require('fs');
const path     = require('path');
const { OpenAI } = require('openai');

const {
  MODEL_ID,
  SYSTEM_BASE,
  STYLES,
  USER_TEMPLATE
} = require('../config/prompts');

require('dotenv').config();

const router  = express.Router();
const upload  = multer({ dest: 'uploads/' });
const openai  = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * POST /analyze   (реальный путь, потому что
 * в server.js есть  app.use('/analyze', analyzeRoute) )
 */
router.post('/', upload.single('handImage'), async (req, res) => {
  try {
    const style   = req.body.style || 'ted';
    const imgPath = req.file?.path;
    if (!imgPath) return res.status(400).json({ error: 'Файл не получен' });

    const img64 = fs.readFileSync(imgPath, 'base64');

    // DEBUG
    console.log('📸', imgPath);
    console.log('📦', img64.length);

    /* ---------- Prompts ---------- */
    const systemPrompt = SYSTEM_BASE + '\n' + (STYLES[style] || '');
    const userPrompt   = USER_TEMPLATE;

    const chat = await openai.chat.completions.create({
      model: MODEL_ID,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            {
              type : 'image_url',
              image_url: {
                url   : `data:image/jpeg;base64,${img64}`,
                detail: 'low'
              }
            }
          ]
        }
      ],
      max_tokens: 4096
    });

    const result = chat.choices?.[0]?.message?.content || '';
    console.log('📄 длина:', result.length);
    console.log('💰 токенов:', chat.usage?.total_tokens);

    res.json({ result });

  } catch (err) {
    console.error('❌', err.message);
    res.status(500).json({ error: 'Ошибка анализа изображения' });
  } finally {
    // удаляем tmp-файл
    if (req.file?.path) fs.rm(req.file.path, () => {});
  }
});

module.exports = router;
