/**
 * API Routes - Market data endpoints
 */

const express = require('express');
const router = express.Router();
const { fetchMarketQuotes } = require('../services/yahooFinanceService');

/**
 * GET /api/market/quotes?symbols=AAPL,GOOGL,MSFT
 * Fetch market quotes for given symbols
 */
router.get('/quotes', async (req, res) => {
  try {
    const symbolsParam = String(req.query.symbols || '').trim();
    const result = await fetchMarketQuotes(symbolsParam);
    res.json(result);
  } catch (err) {
    console.error('market quotes error', err);
    res.status(500).json({ error: 'Failed to fetch market quotes' });
  }
});

module.exports = router;
