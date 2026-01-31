/**
 * Translation utilities
 */

const DICTS = require('../config/translations');

/**
 * Simple text translation using fallback dictionaries
 * @param {string} text - Text to translate
 * @param {object} options - Translation options
 * @returns {string} - Translated text
 */
function simpleTranslateText(text, { sourceLocale, targetLocale }) {
  if (!text || typeof text !== 'string') return text;
  if (!targetLocale || targetLocale === sourceLocale) return text;
  
  const dict = DICTS[targetLocale] || {};
  const translated = dict[text];
  return translated || text;
}

/**
 * Translate an object or array recursively
 * @param {*} obj - Object to translate
 * @param {object} opts - Translation options
 * @returns {*} - Translated object
 */
function simpleTranslateObject(obj, opts) {
  if (obj == null) return obj;
  if (typeof obj === 'string') return simpleTranslateText(obj, opts);
  if (Array.isArray(obj)) return obj.map((v) => simpleTranslateObject(v, opts));
  
  if (typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = simpleTranslateObject(v, opts);
    }
    return out;
  }
  
  return obj;
}

module.exports = {
  simpleTranslateText,
  simpleTranslateObject,
};
