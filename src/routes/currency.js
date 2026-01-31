/**
 * API Routes - Currency conversion endpoints
 */

const express = require('express');
const router = express.Router();
const { convertCurrency } = require('../utils/currency');

/**
 * POST /api/currency/convert
 * Convert amount between currencies
 */
router.post('/convert', (req, res) => {
  try {
    const { amount, from = 'INR', to = 'INR' } = req.body || {};
    const amt = Number(amount);
    
    if (Number.isNaN(amt)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    const converted = convertCurrency(amt, from, to);
    res.json({ amount: converted });
  } catch (err) {
    console.error('currency convert error', err);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

module.exports = router;
