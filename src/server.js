/**
 * Portfolio Manager - Main Server Entry Point
 * Modular Express.js application with clean architecture
 */

const express = require('express');
const path = require('path');
require('dotenv').config();

const { setupMiddleware } = require('./middleware');
const configRoutes = require('./routes/config');
const translateRoutes = require('./routes/translate');
const currencyRoutes = require('./routes/currency');
const marketRoutes = require('./routes/market');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup middleware
setupMiddleware(app);

// API Routes
app.use('/api/config', configRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/chat', chatRoutes);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback route - serve index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
