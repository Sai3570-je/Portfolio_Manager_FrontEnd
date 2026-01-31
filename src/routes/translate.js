/**
 * API Routes - Translation endpoints
 */

const express = require('express');
const router = express.Router();
const { translateText, translateObject } = require('../services/translationService');

/**
 * POST /api/translate/text
 * Translate a single text string
 */
router.post('/text', async (req, res) => {
  try {
    const { text, sourceLocale = 'en', targetLocale = 'en', fast = false } = req.body || {};
    const result = await translateText(text, { sourceLocale, targetLocale, fast });
    res.json({ result });
  } catch (err) {
    console.error('translate text error', err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

/**
 * POST /api/translate/object
 * Translate an entire object
 */
router.post('/object', async (req, res) => {
  try {
    const { content, sourceLocale = 'en', targetLocale = 'en' } = req.body || {};
    const result = await translateObject(content, { sourceLocale, targetLocale });
    res.json({ result });
  } catch (err) {
    console.error('translate object error', err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

module.exports = router;
