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
 * Fetch portfolio by user ID from backend
 * @param {number} userId - User ID (defaults to 1)
 * @returns {Promise<Object>} Portfolio data
 */
async function fetchPortfolio(userId = DEFAULT_USER_ID) {
  try {
    // Try fetching from Spring Boot backend first with userId
    console.log('📡 Fetching portfolio from backend for user:', userId);
    const response = await fetch(`${BACKEND_URL}/portfolio/${userId}`);

    if (response.ok) {
      // Get raw text first to handle malformed JSON
      const text = await response.text();
      console.log('📋 Raw portfolio response:', text.substring(0, 200) + '...');

      try {
        const data = JSON.parse(text);
        console.log('✅ Portfolio fetched from backend:', data);
        // Handle different response formats
        if (data.assets && Array.isArray(data.assets)) return data.assets;
        if (Array.isArray(data)) return data;
        return data.data || data;
      } catch (parseError) {
        console.warn('⚠️ Backend returned invalid JSON, falling back to local API');
        console.warn('Parse error:', parseError.message);
      }
    }

    // Fallback to local Node.js API
    console.log('⚠️ Backend unavailable or invalid response, trying local API...');
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
 * Add asset to portfolio (POST /api/portfolio/asset)
 * @param {Object} assetData - Asset data
 * @returns {Promise<Object>} Created asset
 */
async function createPosition(assetData) {
  try {
    console.log('📡 Adding asset to portfolio:', assetData);

    // Try backend first - uses /api/portfolio/asset endpoint
    const response = await fetch(`${BACKEND_URL}/portfolio/asset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assetData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Asset added on backend:', data);
      return data;
    }

    // Fallback to local
    const localResponse = await fetch(LOCAL_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assetData)
    });

    const result = await localResponse.json();

    if (!localResponse.ok || !result.success) {
      throw new Error(result.error || 'Failed to add asset');
    }

    return result.data;
  } catch (error) {
    console.error('❌ createPosition error:', error);
    throw error;
  }
}

/**
 * Update an existing portfolio asset (PUT /api/portfolio/asset/{id})
 * @param {number} id - Asset ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated asset
 */
async function updatePosition(id, updateData) {
  try {
    console.log('📡 Updating asset:', id, updateData);

    // Try backend first - uses /api/portfolio/asset/{id} endpoint
    const response = await fetch(`${BACKEND_URL}/portfolio/asset/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Asset updated on backend:', data);
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
      throw new Error(result.error || 'Failed to update asset');
    }

    return result.data;
  } catch (error) {
    console.error('❌ updatePosition error:', error);
    throw error;
  }
}

/**
 * Delete a portfolio asset (DELETE /api/portfolio/asset/{id})
 * @param {number} id - Asset ID
 * @returns {Promise<Object>} Deleted asset
 */
async function deletePosition(id) {
  try {
    console.log('📡 Deleting asset:', id);

    // Try backend first - uses /api/portfolio/asset/{id} endpoint
    const response = await fetch(`${BACKEND_URL}/portfolio/asset/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Asset deleted on backend:', data);
      return data;
    }

    // Fallback to local
    const localResponse = await fetch(`${LOCAL_API_BASE}/${id}`, {
      method: 'DELETE'
    });

    const result = await localResponse.json();

    if (!localResponse.ok || !result.success) {
      throw new Error(result.error || 'Failed to delete asset');
    }

    return result.data;
  } catch (error) {
    console.error('❌ deletePosition error:', error);
    throw error;
  }
}

/**
 * Get total portfolio value (GET /api/portfolio/total-value/{portfolioId})
 * @param {number} portfolioId - Portfolio ID
 * @returns {Promise<number>} Total value
 */
async function getPortfolioTotalValue(portfolioId = 1) {
  try {
    console.log('📡 Fetching portfolio total value for:', portfolioId);
    const response = await fetch(`${BACKEND_URL}/portfolio/total-value/${portfolioId}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Portfolio total value:', data);
      return data;
    }

    throw new Error('Failed to get portfolio total value');
  } catch (error) {
    console.error('❌ getPortfolioTotalValue error:', error);
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
  deletePosition,
  getPortfolioTotalValue
};
