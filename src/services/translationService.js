/**
 * Translation service with Lingo.dev integration
 */

const { simpleTranslateText, simpleTranslateObject } = require('../utils/translation');

// Lazy-initialize Lingo.dev SDK
let enginePromise = (async () => {
  try {
    // Check if API key exists before trying to import
    if (!process.env.LINGODOTDEV_API_KEY) {
      console.warn('[info] LINGODOTDEV_API_KEY not set. Using fallback translator.');
      return null;
    }

    // Try to dynamically import lingo.dev
    const lingoModule = await import('lingo.dev/sdk').catch(() => null);
    
    if (!lingoModule) {
      console.warn('[info] lingo.dev SDK not installed. Using fallback translator.');
      return null;
    }
    
    const { LingoDotDevEngine } = lingoModule;
    const engine = new LingoDotDevEngine({
      apiKey: process.env.LINGODOTDEV_API_KEY,
      batchSize: 100,
      idealBatchItemSize: 1000,
    });
    
    console.log('✓ Lingo.dev SDK initialized successfully.');
    return engine;
  } catch (err) {
    console.warn('[info] Lingo.dev SDK not available. Using fallback translator.');
    return null;
  }
})();

/**
 * Translate text using Lingo.dev or fallback
 * @param {string} text - Text to translate
 * @param {object} options - Translation options
 * @returns {Promise<string>} - Translated text
 */
async function translateText(text, options) {
  const engine = await enginePromise;
  
  if (engine) {
    return engine.localizeText(text, options);
  }
  
  return simpleTranslateText(text, options);
}

/**
 * Translate object using Lingo.dev or fallback
 * @param {*} content - Content to translate
 * @param {object} options - Translation options
 * @returns {Promise<*>} - Translated content
 */
async function translateObject(content, options) {
  const engine = await enginePromise;
  
  if (engine) {
    return engine.localizeObject(content, options);
  }
  
  return simpleTranslateObject(content, options);
}

module.exports = {
  translateText,
  translateObject,
};
