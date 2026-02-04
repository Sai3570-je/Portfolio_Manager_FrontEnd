/**
 * Portfolio API Service
 * Handles all CRUD operations for portfolio management
 * Connects to Spring Boot backend at localhost:8080
 */

// Backend API base URL (Spring Boot server)
const BACKEND_URL = 'http://localhost:8080/api';

// Local Node.js server API (fallback)
const LOCAL_API_BASE = '/api/portfolio';

// Default user ID for portfolio operations (configure as needed)
const DEFAULT_USER_ID = 1;

// ============================================
// 📊 INSTRUMENTS API
// ============================================

/**
 * Fetch all instruments
 * GET /api/instruments
 */
async function fetchInstruments() {
  try {
    console.log('📡 Fetching instruments from:', `${BACKEND_URL}/instruments`);
    const response = await fetch(`${BACKEND_URL}/instruments`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Instruments fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchInstruments error:', error);
    throw error;
  }
}

/**
 * Fetch instrument by ID
 * GET /api/instruments/{id}
 */
async function fetchInstrumentById(id) {
  try {
    console.log('📡 Fetching instrument:', id);
    const response = await fetch(`${BACKEND_URL}/instruments/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ fetchInstrumentById error:', error);
    throw error;
  }
}

/**
 * Fetch instrument by symbol
 * GET /api/instruments/by-symbol/{symbol}
 */
async function fetchInstrumentBySymbol(symbol) {
  try {
    console.log('📡 Fetching instrument by symbol:', symbol);
    const response = await fetch(`${BACKEND_URL}/instruments/by-symbol/${symbol}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ fetchInstrumentBySymbol error:', error);
    throw error;
  }
}

/**
 * Create instrument
 * POST /api/instruments
 */
async function createInstrument(data) {
  try {
    console.log('📡 Creating instrument:', data);
    const response = await fetch(`${BACKEND_URL}/instruments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ createInstrument error:', error);
    throw error;
  }
}

/**
 * Update instrument
 * PUT /api/instruments/{id}
 */
async function updateInstrument(id, data) {
  try {
    console.log('📡 Updating instrument:', id, data);
    const response = await fetch(`${BACKEND_URL}/instruments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ updateInstrument error:', error);
    throw error;
  }
}

/**
 * Delete instrument
 * DELETE /api/instruments/{id}
 */
async function deleteInstrument(id) {
  try {
    console.log('📡 Deleting instrument:', id);
    const response = await fetch(`${BACKEND_URL}/instruments/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('✅ Instrument deleted');
    return true;
  } catch (error) {
    console.error('❌ deleteInstrument error:', error);
    throw error;
  }
}

// ============================================
// 💼 PORTFOLIO API
// ============================================

/**
 * Fetch portfolio by user ID
 * GET /api/portfolio/{userId}
 */
async function fetchPortfolio(userId = DEFAULT_USER_ID) {
  try {
    console.log('📡 Fetching portfolio for user:', userId);
    const response = await fetch(`${BACKEND_URL}/portfolio/${userId}`);

    if (response.ok) {
      const text = await response.text();
      console.log('📋 Raw portfolio response:', text.substring(0, 200) + '...');

      try {
        const data = JSON.parse(text);
        console.log('✅ Portfolio fetched from backend:', data);
        if (data.assets && Array.isArray(data.assets)) return data.assets;
        if (Array.isArray(data)) return data;
        return data.data || data;
      } catch (parseError) {
        console.warn('⚠️ Backend returned invalid JSON, falling back to local API');
      }
    }

    // Fallback to local Node.js API
    console.log('⚠️ Trying local API...');
    const localResponse = await fetch(LOCAL_API_BASE);
    const result = await localResponse.json();
    if (!localResponse.ok || !result.success) throw new Error(result.error || 'Failed');
    return result.data;
  } catch (error) {
    console.error('❌ fetchPortfolio error:', error);
    throw error;
  }
}

/**
 * Create portfolio
 * POST /api/portfolio
 */
async function createPortfolio(data) {
  try {
    console.log('📡 Creating portfolio:', data);
    const response = await fetch(`${BACKEND_URL}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ createPortfolio error:', error);
    throw error;
  }
}

/**
 * Add asset to portfolio
 * POST /api/portfolio/asset
 */
async function createPosition(assetData) {
  try {
    console.log('📡 Adding asset to portfolio:', assetData);
    const response = await fetch(`${BACKEND_URL}/portfolio/asset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assetData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Asset added:', data);
      return data;
    }

    // Fallback to local
    const localResponse = await fetch(LOCAL_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assetData)
    });
    const result = await localResponse.json();
    if (!localResponse.ok || !result.success) throw new Error(result.error || 'Failed');
    return result.data;
  } catch (error) {
    console.error('❌ createPosition error:', error);
    throw error;
  }
}

/**
 * Update portfolio asset
 * PUT /api/portfolio/asset/{id}
 */
async function updatePosition(id, updateData) {
  try {
    console.log('📡 Updating asset:', id, updateData);
    const response = await fetch(`${BACKEND_URL}/portfolio/asset/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Asset updated:', data);
      return data;
    }

    // Fallback to local
    const localResponse = await fetch(`${LOCAL_API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const result = await localResponse.json();
    if (!localResponse.ok || !result.success) throw new Error(result.error || 'Failed');
    return result.data;
  } catch (error) {
    console.error('❌ updatePosition error:', error);
    throw error;
  }
}

/**
 * Delete portfolio asset
 * DELETE /api/portfolio/asset/{id}
 */
async function deletePosition(id) {
  try {
    console.log('📡 Deleting asset:', id);
    const response = await fetch(`${BACKEND_URL}/portfolio/asset/${id}`, {
      method: 'DELETE'
    });

    if (response.ok || response.status === 204) {
      console.log('✅ Asset deleted');
      return true;
    }

    // Fallback to local
    const localResponse = await fetch(`${LOCAL_API_BASE}/${id}`, { method: 'DELETE' });
    if (!localResponse.ok) throw new Error('Failed to delete');
    return true;
  } catch (error) {
    console.error('❌ deletePosition error:', error);
    throw error;
  }
}

/**
 * Get portfolio total value
 * GET /api/portfolio/total-value/{portfolioId}
 */
async function getPortfolioTotalValue(portfolioId = 1) {
  try {
    console.log('📡 Fetching portfolio total value:', portfolioId);
    const response = await fetch(`${BACKEND_URL}/portfolio/total-value/${portfolioId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ getPortfolioTotalValue error:', error);
    throw error;
  }
}

// ============================================
// 📈 POSITIONS API
// ============================================

/**
 * Fetch all positions
 * GET /api/positions
 */
async function fetchPositions() {
  try {
    console.log('📡 Fetching positions');
    const response = await fetch(`${BACKEND_URL}/positions`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Positions fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchPositions error:', error);
    throw error;
  }
}

/**
 * Fetch position by ID
 * GET /api/positions/{id}
 */
async function fetchPositionById(id) {
  try {
    console.log('📡 Fetching position:', id);
    const response = await fetch(`${BACKEND_URL}/positions/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ fetchPositionById error:', error);
    throw error;
  }
}

/**
 * Get holdings count
 * GET /api/positions/holdings-count
 */
async function getHoldingsCount() {
  try {
    const response = await fetch(`${BACKEND_URL}/positions/holdings-count`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ getHoldingsCount error:', error);
    throw error;
  }
}

/**
 * Get total portfolio value
 * GET /api/positions/total-portfolio-value
 */
async function getTotalPortfolioValue() {
  try {
    const response = await fetch(`${BACKEND_URL}/positions/total-portfolio-value`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ getTotalPortfolioValue error:', error);
    throw error;
  }
}

/**
 * Get total investment
 * GET /api/positions/total-investment
 */
async function getTotalInvestment() {
  try {
    const response = await fetch(`${BACKEND_URL}/positions/total-investment`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ getTotalInvestment error:', error);
    throw error;
  }
}

/**
 * Get total gain/loss
 * GET /api/positions/total-gain-loss
 */
async function getTotalGainLoss() {
  try {
    const response = await fetch(`${BACKEND_URL}/positions/total-gain-loss`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ getTotalGainLoss error:', error);
    throw error;
  }
}

/**
 * Create position
 * POST /api/positions
 */
async function createNewPosition(data) {
  try {
    console.log('📡 Creating position:', data);
    const response = await fetch(`${BACKEND_URL}/positions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ createNewPosition error:', error);
    throw error;
  }
}

/**
 * Update position
 * PUT /api/positions/{id}
 */
async function updatePositionById(id, data) {
  try {
    console.log('📡 Updating position:', id, data);
    const response = await fetch(`${BACKEND_URL}/positions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ updatePositionById error:', error);
    throw error;
  }
}

/**
 * Delete position
 * DELETE /api/positions/{id}
 */
async function deletePositionById(id) {
  try {
    console.log('📡 Deleting position:', id);
    const response = await fetch(`${BACKEND_URL}/positions/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok && response.status !== 204) throw new Error(`HTTP ${response.status}`);
    console.log('✅ Position deleted');
    return true;
  } catch (error) {
    console.error('❌ deletePositionById error:', error);
    throw error;
  }
}

// ============================================
// 🛒 ORDERS API
// ============================================

/**
 * Fetch all orders
 * GET /api/orders
 */
async function fetchOrders() {
  try {
    console.log('📡 Fetching orders');
    const response = await fetch(`${BACKEND_URL}/orders`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Orders fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchOrders error:', error);
    throw error;
  }
}

/**
 * Fetch order by ID
 * GET /api/orders/{id}
 */
async function fetchOrderById(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/orders/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ fetchOrderById error:', error);
    throw error;
  }
}

/**
 * Create order
 * POST /api/orders
 */
async function createOrder(data) {
  try {
    console.log('📡 Creating order:', data);
    const response = await fetch(`${BACKEND_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ createOrder error:', error);
    throw error;
  }
}

/**
 * Execute order
 * POST /api/orders/{id}/execute
 */
async function executeOrder(id) {
  try {
    console.log('📡 Executing order:', id);
    const response = await fetch(`${BACKEND_URL}/orders/${id}/execute`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ executeOrder error:', error);
    throw error;
  }
}

/**
 * Update order
 * PUT /api/orders/{id}
 */
async function updateOrder(id, data) {
  try {
    console.log('📡 Updating order:', id, data);
    const response = await fetch(`${BACKEND_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ updateOrder error:', error);
    throw error;
  }
}

/**
 * Delete order
 * DELETE /api/orders/{id}
 */
async function deleteOrder(id) {
  try {
    console.log('📡 Deleting order:', id);
    const response = await fetch(`${BACKEND_URL}/orders/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok && response.status !== 204) throw new Error(`HTTP ${response.status}`);
    return true;
  } catch (error) {
    console.error('❌ deleteOrder error:', error);
    throw error;
  }
}

// ============================================
// 💹 MARKET QUOTES API
// ============================================

/**
 * Fetch all market quotes
 * GET /api/market/quotes
 */
async function fetchMarketQuotes() {
  try {
    console.log('📡 Fetching market quotes');
    const response = await fetch(`${BACKEND_URL}/market/quotes`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Market quotes fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchMarketQuotes error:', error);
    throw error;
  }
}

/**
 * Fetch market quote by ID
 * GET /api/market/quotes/{id}
 */
async function fetchMarketQuoteById(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/market/quotes/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ fetchMarketQuoteById error:', error);
    throw error;
  }
}

/**
 * Fetch quotes by instrument
 * GET /api/market/quotes/by-instrument/{instrumentId}
 */
async function fetchQuotesByInstrument(instrumentId) {
  try {
    const response = await fetch(`${BACKEND_URL}/market/quotes/by-instrument/${instrumentId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ fetchQuotesByInstrument error:', error);
    throw error;
  }
}

/**
 * Create market quote
 * POST /api/market/quotes
 */
async function createMarketQuote(data) {
  try {
    console.log('📡 Creating market quote:', data);
    const response = await fetch(`${BACKEND_URL}/market/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ createMarketQuote error:', error);
    throw error;
  }
}

// ============================================
// 👁️ WATCHLIST API
// ============================================

/**
 * Fetch watchlist
 * GET /api/watchlist
 */
async function fetchWatchlist() {
  try {
    console.log('📡 Fetching watchlist');
    const response = await fetch(`${BACKEND_URL}/watchlist`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Watchlist fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchWatchlist error:', error);
    throw error;
  }
}

/**
 * Add to watchlist
 * POST /api/watchlist
 */
async function addToWatchlistAPI(data) {
  try {
    console.log('📡 Adding to watchlist:', data);
    const response = await fetch(`${BACKEND_URL}/watchlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ addToWatchlistAPI error:', error);
    throw error;
  }
}

/**
 * Remove from watchlist by ID
 * DELETE /api/watchlist/{id}
 */
async function removeFromWatchlistAPI(id) {
  try {
    console.log('📡 Removing from watchlist:', id);
    const response = await fetch(`${BACKEND_URL}/watchlist/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok && response.status !== 204) throw new Error(`HTTP ${response.status}`);
    return true;
  } catch (error) {
    console.error('❌ removeFromWatchlistAPI error:', error);
    throw error;
  }
}

/**
 * Remove from watchlist by instrument ID
 * DELETE /api/watchlist/by-instrument/{instrumentId}
 */
async function removeFromWatchlistByInstrument(instrumentId) {
  try {
    console.log('📡 Removing from watchlist by instrument:', instrumentId);
    const response = await fetch(`${BACKEND_URL}/watchlist/by-instrument/${instrumentId}`, {
      method: 'DELETE'
    });
    if (!response.ok && response.status !== 204) throw new Error(`HTTP ${response.status}`);
    return true;
  } catch (error) {
    console.error('❌ removeFromWatchlistByInstrument error:', error);
    throw error;
  }
}

// ============================================
// 📜 TRANSACTIONS API
// ============================================

/**
 * Fetch all transactions
 * GET /api/transactions
 */
async function fetchTransactions() {
  try {
    console.log('📡 Fetching transactions');
    const response = await fetch(`${BACKEND_URL}/transactions`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Transactions fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchTransactions error:', error);
    throw error;
  }
}

/**
 * Fetch transaction by ID
 * GET /api/transactions/{id}
 */
async function fetchTransactionById(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/transactions/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ fetchTransactionById error:', error);
    throw error;
  }
}

/**
 * Create transaction
 * POST /api/transactions
 */
async function createTransaction(data) {
  try {
    console.log('📡 Creating transaction:', data);
    const response = await fetch(`${BACKEND_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ createTransaction error:', error);
    throw error;
  }
}

// ============================================
// 📸 SNAPSHOTS API
// ============================================

/**
 * Fetch all snapshots
 * GET /api/snapshots
 */
async function fetchSnapshots() {
  try {
    console.log('📡 Fetching snapshots from:', `${BACKEND_URL}/snapshots`);
    const response = await fetch(`${BACKEND_URL}/snapshots`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Snapshots fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchSnapshots error:', error);
    throw error;
  }
}

/**
 * Fetch snapshot by ID
 * GET /api/snapshots/{id}
 */
async function fetchSnapshotById(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/snapshots/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ fetchSnapshotById error:', error);
    throw error;
  }
}

/**
 * Create snapshot
 * POST /api/snapshots
 */
async function createSnapshot(data) {
  try {
    console.log('📡 Creating snapshot:', data);
    const response = await fetch(`${BACKEND_URL}/snapshots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ createSnapshot error:', error);
    throw error;
  }
}

// ============================================
// EXPORT ALL API FUNCTIONS
// ============================================

window.portfolioAPI = {
  // Instruments
  fetchInstruments,
  fetchInstrumentById,
  fetchInstrumentBySymbol,
  createInstrument,
  updateInstrument,
  deleteInstrument,

  // Portfolio
  fetchPortfolio,
  createPortfolio,
  createPosition,
  updatePosition,
  deletePosition,
  getPortfolioTotalValue,

  // Positions
  fetchPositions,
  fetchPositionById,
  getHoldingsCount,
  getTotalPortfolioValue,
  getTotalInvestment,
  getTotalGainLoss,
  createNewPosition,
  updatePositionById,
  deletePositionById,

  // Orders
  fetchOrders,
  fetchOrderById,
  createOrder,
  executeOrder,
  updateOrder,
  deleteOrder,

  // Market Quotes
  fetchMarketQuotes,
  fetchMarketQuoteById,
  fetchQuotesByInstrument,
  createMarketQuote,

  // Watchlist
  fetchWatchlist,
  addToWatchlistAPI,
  removeFromWatchlistAPI,
  removeFromWatchlistByInstrument,

  // Transactions
  fetchTransactions,
  fetchTransactionById,
  createTransaction,

  // Snapshots
  fetchSnapshots,
  fetchSnapshotById,
  createSnapshot
};
