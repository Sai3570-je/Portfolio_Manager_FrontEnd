/**
 * Currency conversion utilities
 */

const { FX_RATES_INR_BASE } = require('../config/constants');

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @returns {number} - Converted amount
 */
function convertCurrency(amount, from, to) {
  const fromRate = FX_RATES_INR_BASE[from];
  const toRate = FX_RATES_INR_BASE[to];
  
  if (fromRate == null || toRate == null) {
    return amount; // Return original if unsupported currency
  }
  
  // Convert via INR base
  const amountInINR = amount / fromRate;
  return amountInINR * toRate;
}

module.exports = {
  convertCurrency,
};
