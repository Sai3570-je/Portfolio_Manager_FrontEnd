const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lazy-initialize Lingo.dev SDK (with graceful fallback if missing)
let enginePromise = (async () => {
  try {
    const { LingoDotDevEngine } = await import('lingo.dev/sdk');
    if (!process.env.LINGODOTDEV_API_KEY) {
      throw new Error('Missing LINGODOTDEV_API_KEY');
    }
    const engine = new LingoDotDevEngine({
      apiKey: process.env.LINGODOTDEV_API_KEY,
      batchSize: 100,
      idealBatchItemSize: 1000,
    });
    console.log('Lingo.dev SDK initialized.');
    return engine;
  } catch (err) {
    console.warn('[warning] Lingo.dev SDK not available or API key missing. Falling back to local translator. Reason:', err.message);
    return null;
  }
})();

// Supported locales and currencies
const SUPPORTED_LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'te', label: 'తెలుగు' },
];

const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
];

// Simple static FX rates relative to INR. In real app, source from a rates API.
const FX_RATES_INR_BASE = {
  INR: 1,
  USD: 0.012, // 1 INR = 0.012 USD (approx, example)
  AED: 0.044, // 1 INR = 0.044 AED (approx, example)
};

function convertCurrency(amount, from, to) {
  const fromRate = FX_RATES_INR_BASE[from];
  const toRate = FX_RATES_INR_BASE[to];
  if (fromRate == null || toRate == null) return amount; // unsupported => no-op
  // Convert via INR base
  const amountInINR = amount / fromRate; // get to INR
  return amountInINR * toRate; // then to target
}

// Fallback dictionaries for minimal phrase coverage used in demo UI
const DICTS = {
  hi: {
    'Welcome to our store': 'हमारी दुकान में आपका स्वागत है',
    'Choose your language and currency': 'अपनी भाषा और मुद्रा चुनें',
    'Price': 'कीमत',
    'Buy now': 'अभी खरीदें',
    'Sample product description': 'नमूना उत्पाद विवरण',
    'Language': 'भाषा',
    'Currency': 'मुद्रा',
  },
  mr: {
    'Welcome to our store': 'आमच्या दुकानात आपले स्वागत आहे',
    'Choose your language and currency': 'आपली भाषा आणि चलन निवडा',
    'Price': 'किंमत',
    'Buy now': 'आता खरेदी करा',
    'Sample product description': 'नमुना उत्पादन वर्णन',
    'Language': 'भाषा',
    'Currency': 'चलन',
  },
  te: {
    'Welcome to our store': 'మా దుకాణానికి స్వాగతం',
    'Choose your language and currency': 'మీ భాష మరియు కరెన్సీని ఎంచుకోండి',
    'Price': 'ధర',
    'Buy now': 'ఇప్పుడు కొనండి',
    'Sample product description': 'నమూనా ఉత్పత్తి వివరణ',
    'Language': 'భాష',
    'Currency': 'కరెన్సీ',
  },
};

function simpleTranslateText(text, { sourceLocale, targetLocale }) {
  if (!text || typeof text !== 'string') return text;
  if (!targetLocale || targetLocale === sourceLocale) return text;
  const dict = DICTS[targetLocale] || {};
  const translated = dict[text];
  return translated || text; // if unknown, keep original
}

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

async function translateText(text, options) {
  const engine = await enginePromise;
  if (engine) {
    return engine.localizeText(text, options);
  }
  return simpleTranslateText(text, options);
}

async function translateObject(content, options) {
  const engine = await enginePromise;
  if (engine) {
    return engine.localizeObject(content, options);
  }
  return simpleTranslateObject(content, options);
}

// API routes
app.get('/api/config', (req, res) => {
  res.json({
    locales: SUPPORTED_LOCALES,
    currencies: SUPPORTED_CURRENCIES,
    fx: FX_RATES_INR_BASE,
    defaultLocale: 'en',
    defaultCurrency: 'INR',
  });
});

app.post('/api/translate/text', async (req, res) => {
  try {
    const { text, sourceLocale = 'en', targetLocale = 'en', fast = false } = req.body || {};
    const result = await translateText(text, { sourceLocale, targetLocale, fast });
    res.json({ result });
  } catch (err) {
    console.error('translate text error', err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.post('/api/translate/object', async (req, res) => {
  try {
    const { content, sourceLocale = 'en', targetLocale = 'en' } = req.body || {};
    const result = await translateObject(content, { sourceLocale, targetLocale });
    res.json({ result });
  } catch (err) {
    console.error('translate object error', err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.post('/api/currency/convert', (req, res) => {
  try {
    const { amount, from = 'INR', to = 'INR' } = req.body || {};
    const amt = Number(amount);
    if (Number.isNaN(amt)) return res.status(400).json({ error: 'Invalid amount' });
    const converted = convertCurrency(amt, from, to);
    res.json({ amount: converted });
  } catch (err) {
    console.error('currency convert error', err);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

// Yahoo Finance proxy endpoints
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function mapQuote(q) {
  return {
    symbol: q.symbol,
    name: q.longName || q.shortName || q.symbol,
    price: typeof q.regularMarketPrice === 'number' ? q.regularMarketPrice : null,
    change: typeof q.regularMarketChange === 'number' ? q.regularMarketChange : 0,
    changePercent: typeof q.regularMarketChangePercent === 'number' ? q.regularMarketChangePercent : 0,
    volume: q.regularMarketVolume != null ? q.regularMarketVolume.toLocaleString() : '—',
  };
}

app.get('/api/market/quotes', async (req, res) => {
  try {
    const symbolsParam = String(req.query.symbols || '').trim();
    if (!symbolsParam) return res.json({ items: [], fallbackUsed: true });
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolsParam)}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Yahoo response ${r.status}`);
    const data = await r.json();
    const results = (data && data.quoteResponse && Array.isArray(data.quoteResponse.result)) ? data.quoteResponse.result : [];
    const items = results.map(mapQuote).filter(i => i.price != null);
    res.json({ items, fallbackUsed: false });
  } catch (err) {
    console.warn('quotes fetch failed, falling back:', err.message);
    res.json({ items: [], fallbackUsed: true });
  }
});

// Serve static frontend from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to public/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
