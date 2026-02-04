/**
 * Portfolio API Service
 * Handles all CRUD operations for portfolio management
 * Connects to Spring Boot backend at localhost:8080
 */

// Backend API base URL (Spring Boot server)
const BACKEND_URL = 'http://localhost:8080/api';

// Local Node.js server API (fallback)
const LOCAL_API_BASE = '/api/portfolio';

/**
 * Fetch all instruments from backend
 * @returns {Promise<Array>} Array of instruments
 */
async function fetchInstruments() {
  try {
    console.log('📡 Fetching instruments from:', `${BACKEND_URL}/instruments`);
    const response = await fetch(`${BACKEND_URL}/instruments`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch instruments`);
    }

    const data = await response.json();
    console.log('✅ Instruments fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchInstruments error:', error);
    throw error;
  }
}

/**
 * Fetch all snapshots from backend
 * @returns {Promise<Array>} Array of snapshots
 */
async function fetchSnapshots() {
  try {
    console.log('📡 Fetching snapshots from:', `${BACKEND_URL}/snapshots`);
    const response = await fetch(`${BACKEND_URL}/snapshots`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch snapshots`);
    }

    const data = await response.json();
    console.log('✅ Snapshots fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchSnapshots error:', error);
    throw error;
  }
}

/**
 * Fetch all portfolio holdings (tries backend first, falls back to local)
 * @returns {Promise<Array>} Array of portfolio holdings
 */
async function fetchPortfolio() {
  try {
    // Try fetching from Spring Boot backend first
    console.log('📡 Fetching portfolio from backend...');
    const response = await fetch(`${BACKEND_URL}/portfolio`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Portfolio fetched from backend:', data);
      return Array.isArray(data) ? data : (data.data || data);
    }

    // Fallback to local Node.js API
    console.log('⚠️ Backend unavailable, trying local API...');
    const localResponse = await fetch(LOCAL_API_BASE);
    const result = await localResponse.json();

    if (!localResponse.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch portfolio');
    }

    return result.data;
  } catch (error) {
    console.error('❌ fetchPortfolio error:', error);
    throw error;
  }
}

/**
 * Fetch a single portfolio holding by ID
 * @param {number} id - Holding ID
 * @returns {Promise<Object>} Portfolio holding
 */
async function fetchHolding(id) {
  try {
    // Try backend first
    const response = await fetch(`${BACKEND_URL}/portfolio/${id}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Holding fetched from backend:', data);
      return data;
    }

    // Fallback to local
    const localResponse = await fetch(`${LOCAL_API_BASE}/${id}`);
    const result = await localResponse.json();

    if (!localResponse.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch holding');
    }

    return result.data;
  } catch (error) {
    console.error('❌ fetchHolding error:', error);
    throw error;
  }
}

/**
 * Create a new portfolio position
 * @param {Object} positionData - Position data
 * @param {string} positionData.tickerSymbol - Stock ticker symbol
 * @param {string} positionData.assetName - Asset name
 * @param {string} positionData.assetType - Asset type (STOCK, ETF, CRYPTO)
 * @param {number} positionData.quantity - Number of shares
 * @param {number} positionData.purchasePrice - Purchase price per share
 * @param {number} [positionData.currentPrice] - Current price per share
 * @returns {Promise<Object>} Created position
 */
async function createPosition(positionData) {
  try {
    console.log('📡 Creating position:', positionData);

    // Try backend first
    const response = await fetch(`${BACKEND_URL}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(positionData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Position created on backend:', data);
      return data;
    }

    // Fallback to local
    const localResponse = await fetch(LOCAL_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(positionData)
    });

    const result = await localResponse.json();

    if (!localResponse.ok || !result.success) {
      throw new Error(result.error || 'Failed to create position');
    }

    return result.data;
  } catch (error) {
    console.error('❌ createPosition error:', error);
    throw error;
  }
}

/**
 * Update an existing portfolio position
 * @param {number} id - Holding ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated position
 */
async function updatePosition(id, updateData) {
  try {
    console.log('📡 Updating position:', id, updateData);

    // Try backend first
    const response = await fetch(`${BACKEND_URL}/portfolio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Position updated on backend:', data);
      return data;
    }

    // Fallback to local
    const localResponse = await fetch(`${LOCAL_API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    const result = await localResponse.json();

    if (!localResponse.ok || !result.success) {
      throw new Error(result.error || 'Failed to update position');
    }

    return result.data;
  } catch (error) {
    console.error('❌ updatePosition error:', error);
    throw error;
  }
}

/**
 * Delete a portfolio position
 * @param {number} id - Holding ID
 * @returns {Promise<Object>} Deleted position
 */
async function deletePosition(id) {
  try {
    console.log('📡 Deleting position:', id);

    // Try backend first
    const response = await fetch(`${BACKEND_URL}/portfolio/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Position deleted on backend:', data);
      return data;
    }

    // Fallback to local
    const localResponse = await fetch(`${LOCAL_API_BASE}/${id}`, {
      method: 'DELETE'
    });

    const result = await localResponse.json();

    if (!localResponse.ok || !result.success) {
      throw new Error(result.error || 'Failed to delete position');
    }

    return result.data;
  } catch (error) {
    console.error('❌ deletePosition error:', error);
    throw error;
  }
}

// Export functions globally for use in app.js
window.portfolioAPI = {
  fetchInstruments,
  fetchSnapshots,
  fetchPortfolio,
  fetchHolding,
  createPosition,
  updatePosition,
  deletePosition
};
