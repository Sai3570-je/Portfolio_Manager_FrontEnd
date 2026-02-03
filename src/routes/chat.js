/**
 * Chatbot Routes - AI Assistant API Endpoints
 * Handles chat interactions with error handling and session management
 */

const express = require('express');
const openaiService = require('../services/openaiService');
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

    // Get AI response
    const aiResponse = await openaiService.sendMessage(
      userMessage,
      req.session.messages.filter(msg => msg.role === 'user' || msg.role === 'assistant'),
      req.session.userContext
    );

    // Add AI response to session history
    const assistantMessage = {
      role: 'assistant',
      content: aiResponse.message,
      timestamp: aiResponse.timestamp,
      isFallback: aiResponse.isFallback || false,
      metadata: {
        model: aiResponse.model,
        tokensUsed: aiResponse.tokensUsed
      }
    };

    req.session.messages.push(assistantMessage);

    // Keep only last 20 messages to prevent memory issues
    if (req.session.messages.length > 20) {
      req.session.messages = req.session.messages.slice(-20);
    }

    res.json({
      success: true,
      message: aiResponse.message,
      sessionId: req.session.id,
      isFallback: aiResponse.isFallback || false,
      timestamp: aiResponse.timestamp,
      metadata: {
        messagesInSession: req.session.messages.length,
        model: aiResponse.model,
        tokensUsed: aiResponse.tokensUsed
      }
    });

  } catch (error) {
    console.error('Chat message error:', error);

    // Return intelligent fallback response based on error type
    let fallbackMessage = "I'm experiencing technical difficulties. Please try again in a moment.";

    if (error.code === 'insufficient_quota' || error.status === 429) {
      fallbackMessage = "I'm currently in offline mode due to API usage limits. While my AI features are unavailable, you can still use the dashboard to view your portfolio, add positions, and access market data. How can I help you navigate the interface?";
    } else if (error.code === 'invalid_api_key' || error.status === 401) {
      fallbackMessage = "I'm running in offline mode due to configuration issues. Your portfolio data is still secure and accessible. Would you like me to guide you through using the dashboard features?";
    } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      fallbackMessage = "I'm having trouble connecting to my AI services right now. Your portfolio data is still secure and accessible. Would you like me to guide you through using the dashboard features?";
    }

    const fallbackResponse = {
      success: true,
      message: fallbackMessage,
      sessionId: req.session?.id || 'unknown',
      isFallback: true,
      timestamp: new Date().toISOString(),
      errorType: error.code || error.type || 'unknown'
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
  try {
    const isOpenAIAvailable = await openaiService.validateConnection();

    res.json({
      success: true,
      status: 'operational',
      services: {
        openai: isOpenAIAvailable ? 'available' : 'fallback_mode',
        sessions: chatSessions.size
      },
      fallbackMode: !isOpenAIAvailable
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.json({
      success: true,
      status: 'degraded',
      services: {
        openai: 'fallback_mode',
        sessions: chatSessions.size
      },
      fallbackMode: true
    });
  }
});

module.exports = router;
