/**
 * Configuration constants for the Portfolio Manager application
 */

// Supported locales
const SUPPORTED_LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'te', label: 'తెలుగు' },
];

// Supported currencies
const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
];

// Exchange rates (relative to INR)
const FX_RATES_INR_BASE = {
  INR: 1,
  USD: 0.012,
  AED: 0.044,
};

// Default settings
const DEFAULT_LOCALE = 'en';
const DEFAULT_CURRENCY = 'INR';

module.exports = {
  SUPPORTED_LOCALES,
  SUPPORTED_CURRENCIES,
  FX_RATES_INR_BASE,
  DEFAULT_LOCALE,
  DEFAULT_CURRENCY,
};
