/**
 * Chatbot Routes - Default Response Assistant API Endpoints
 * Handles chat interactions with fallback responses and session management
 */

const express = require('express');
const router = express.Router();

// In-memory session storage (in production, use Redis or database)
const chatSessions = new Map();

// Middleware to handle session management
const getOrCreateSession = (req, res, next) => {
  const sessionId = req.headers['x-session-id'] || req.body.sessionId || 'default';

  if (!chatSessions.has(sessionId)) {
    chatSessions.set(sessionId, {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      userContext: {}
    });
  }

  req.session = chatSessions.get(sessionId);
  req.session.lastActivity = new Date();
  next();
};

// Default portfolio responses based on user queries
function generateDefaultResponse(message) {
  const msg = message.toLowerCase();

  // Greeting responses
  if (msg.match(/^(hi|hello|hey|good morning|good afternoon|good evening)$/i)) {
    return "Hello! I'm your portfolio advisor. How can I help you today?";
  }

  // Stock recommendations
  if (msg.includes('stock') || msg.includes('recommend')) {
    return "For stock selection, I recommend focusing on companies with strong fundamentals, consistent earnings growth, and competitive advantages. Consider diversifying across sectors and market caps.";
  }

  // Investment advice
  if (msg.includes('invest') || msg.includes('buy') || msg.includes('purchase')) {
    return "A disciplined investment approach works best. Consider dollar-cost averaging for volatile markets and always align investments with your risk tolerance and time horizon.";
  }

  // Market analysis
  if (msg.includes('market') || msg.includes('analysis')) {
    return "Current market conditions require careful analysis. Focus on quality companies trading at reasonable valuations. Diversification remains key in uncertain times.";
  }

  // Portfolio advice
  if (msg.includes('portfolio') || msg.includes('holding')) {
    return "Review your portfolio regularly. Consider rebalancing if any position exceeds 10% of total value. Diversification across sectors helps manage risk effectively.";
  }

  // Default response
  return "I'm here to help with investment advice, market analysis, and portfolio management. Feel free to ask about specific stocks, market trends, or investment strategies.";
}

/**
 * POST /api/chat/message
 * Send a message to the AI assistant
 */
router.post('/message', getOrCreateSession, async (req, res) => {
  try {
    const { message, userContext } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required and cannot be empty',
        success: false
      });
    }

    const userMessage = message.trim();

    // Add user message to session history
    req.session.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    });

    // Update user context if provided
    if (userContext) {
      req.session.userContext = { ...req.session.userContext, ...userContext };
    }

    console.log(`Processing chat message for session ${req.session.id}`);

    // Generate default response
    const responseMessage = generateDefaultResponse(userMessage);

    // Add response to session history
    const assistantMessage = {
      role: 'assistant',
      content: responseMessage,
      timestamp: new Date().toISOString(),
      isFallback: true
    };

    req.session.messages.push(assistantMessage);

    // Keep only last 20 messages to prevent memory issues
    if (req.session.messages.length > 20) {
      req.session.messages = req.session.messages.slice(-20);
    }

    res.json({
      success: true,
      message: responseMessage,
      sessionId: req.session.id,
      isFallback: true,
      timestamp: new Date().toISOString(),
      metadata: {
        messagesInSession: req.session.messages.length
      }
    });

  } catch (error) {
    console.error('Chat message error:', error);

    const fallbackResponse = {
      success: true,
      message: "I'm here to help with your portfolio questions. Please try asking again.",
      sessionId: req.session?.id || 'unknown',
      isFallback: true,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(fallbackResponse);
  }
});

/**
 * GET /api/chat/history
 * Get chat history for the current session
 */
router.get('/history', getOrCreateSession, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const messages = req.session.messages.slice(-limit);

    res.json({
      success: true,
      sessionId: req.session.id,
      messages: messages,
      totalMessages: req.session.messages.length
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat history'
    });
  }
});

/**
 * POST /api/chat/clear
 * Clear chat history for the current session
 */
router.post('/clear', getOrCreateSession, (req, res) => {
  try {
    req.session.messages = [];
    req.session.userContext = {};

    res.json({
      success: true,
      message: 'Chat history cleared',
      sessionId: req.session.id
    });
  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear chat history'
    });
  }
});

/**
 * GET /api/chat/status
 * Check chatbot service status
 */
router.get('/status', async (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    services: {
      defaultResponses: 'available',
      sessions: chatSessions.size
    },
    fallbackMode: true
  });
});

module.exports = router;
