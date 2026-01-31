/**
 * Yahoo Finance API service
 */

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

/**
 * Map Yahoo Finance quote to simplified format
 * @param {object} q - Yahoo Finance quote object
 * @returns {object} - Simplified quote object
 */
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

/**
 * Fetch market quotes from Yahoo Finance
 * @param {string} symbolsParam - Comma-separated list of symbols
 * @returns {Promise<object>} - Quote results
 */
async function fetchMarketQuotes(symbolsParam) {
  if (!symbolsParam) {
    return { items: [], fallbackUsed: true };
  }

  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolsParam)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Yahoo response ${response.status}`);
    }
    
    const data = await response.json();
    const results = (data && data.quoteResponse && Array.isArray(data.quoteResponse.result))
      ? data.quoteResponse.result
      : [];
    
    return {
      items: results.map(mapQuote),
      fallbackUsed: false,
    };
  } catch (err) {
    console.error('Yahoo Finance API error:', err);
    return { items: [], fallbackUsed: true, error: err.message };
  }
}

module.exports = {
  fetchMarketQuotes,
  mapQuote,
};
