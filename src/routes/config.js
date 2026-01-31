/**
 * API Routes - Configuration endpoints
 */

const express = require('express');
const router = express.Router();
const {
  SUPPORTED_LOCALES,
  SUPPORTED_CURRENCIES,
  FX_RATES_INR_BASE,
  DEFAULT_LOCALE,
  DEFAULT_CURRENCY,
} = require('../config/constants');

/**
 * GET /api/config
 * Get application configuration
 */
router.get('/', (req, res) => {
  res.json({
    locales: SUPPORTED_LOCALES,
    currencies: SUPPORTED_CURRENCIES,
    fx: FX_RATES_INR_BASE,
    defaultLocale: DEFAULT_LOCALE,
    defaultCurrency: DEFAULT_CURRENCY,
  });
});

module.exports = router;
