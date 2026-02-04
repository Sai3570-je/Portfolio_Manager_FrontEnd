/**
 * API Routes - Portfolio CRUD endpoints
 */

const express = require('express');
const router = express.Router();

// In-memory portfolio data store (replace with database in production)
let portfolioData = [
  { id: 1, tickerSymbol: 'AAPL', assetName: 'Apple Inc.', assetType: 'STOCK', quantity: 50, purchasePrice: 150.00, currentPrice: 178.72 },
  { id: 2, tickerSymbol: 'GOOGL', assetName: 'Alphabet Inc.', assetType: 'STOCK', quantity: 25, purchasePrice: 140.00, currentPrice: 175.45 },
  { id: 3, tickerSymbol: 'MSFT', assetName: 'Microsoft Corp.', assetType: 'STOCK', quantity: 30, purchasePrice: 380.00, currentPrice: 420.10 },
  { id: 4, tickerSymbol: 'SPY', assetName: 'SPDR S&P 500 ETF', assetType: 'ETF', quantity: 40, purchasePrice: 475.00, currentPrice: 520.00 },
  { id: 5, tickerSymbol: 'NVDA', assetName: 'NVIDIA Corp.', assetType: 'STOCK', quantity: 10, purchasePrice: 450.00, currentPrice: 875.30 }
];

let nextId = 6;

/**
 * GET /api/portfolio
 * Fetch all portfolio holdings
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: portfolioData,
      count: portfolioData.length
    });
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch portfolio' });
  }
});

/**
 * GET /api/portfolio/:id
 * Fetch a single portfolio holding by ID
 */
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const holding = portfolioData.find(item => item.id === id);

    if (!holding) {
      return res.status(404).json({ success: false, error: 'Holding not found' });
    }

    res.json({ success: true, data: holding });
  } catch (err) {
    console.error('Error fetching holding:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch holding' });
  }
});

/**
 * POST /api/portfolio
 * Create a new portfolio holding
 */
router.post('/', (req, res) => {
  try {
    const { tickerSymbol, assetName, assetType, quantity, purchasePrice, currentPrice } = req.body;

    // Validation
    if (!tickerSymbol || !assetName || !quantity || !purchasePrice) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tickerSymbol, assetName, quantity, purchasePrice'
      });
    }

    const newHolding = {
      id: nextId++,
      tickerSymbol: tickerSymbol.toUpperCase(),
      assetName,
      assetType: assetType || 'STOCK',
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      currentPrice: parseFloat(currentPrice) || parseFloat(purchasePrice)
    };

    portfolioData.push(newHolding);

    res.status(201).json({
      success: true,
      data: newHolding,
      message: 'Holding created successfully'
    });
  } catch (err) {
    console.error('Error creating holding:', err);
    res.status(500).json({ success: false, error: 'Failed to create holding' });
  }
});

/**
 * PUT /api/portfolio/:id
 * Update an existing portfolio holding
 */
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const holdingIndex = portfolioData.findIndex(item => item.id === id);

    if (holdingIndex === -1) {
      return res.status(404).json({ success: false, error: 'Holding not found' });
    }

    const { tickerSymbol, assetName, assetType, quantity, purchasePrice, currentPrice } = req.body;

    // Update only provided fields
    const updatedHolding = {
      ...portfolioData[holdingIndex],
      ...(tickerSymbol && { tickerSymbol: tickerSymbol.toUpperCase() }),
      ...(assetName && { assetName }),
      ...(assetType && { assetType }),
      ...(quantity !== undefined && { quantity: parseFloat(quantity) }),
      ...(purchasePrice !== undefined && { purchasePrice: parseFloat(purchasePrice) }),
      ...(currentPrice !== undefined && { currentPrice: parseFloat(currentPrice) })
    };

    portfolioData[holdingIndex] = updatedHolding;

    res.json({
      success: true,
      data: updatedHolding,
      message: 'Holding updated successfully'
    });
  } catch (err) {
    console.error('Error updating holding:', err);
    res.status(500).json({ success: false, error: 'Failed to update holding' });
  }
});

/**
 * DELETE /api/portfolio/:id
 * Delete a portfolio holding
 */
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const holdingIndex = portfolioData.findIndex(item => item.id === id);

    if (holdingIndex === -1) {
      return res.status(404).json({ success: false, error: 'Holding not found' });
    }

    const deletedHolding = portfolioData.splice(holdingIndex, 1)[0];

    res.json({
      success: true,
      data: deletedHolding,
      message: 'Holding deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting holding:', err);
    res.status(500).json({ success: false, error: 'Failed to delete holding' });
  }
});

module.exports = router;
