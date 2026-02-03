/**
 * Chatbot Routes - Multi-AI Assistant API Endpoints with Fallback System
 * Handles chat interactions with OpenAI, Gemini AI, and default responses
 */

const express = require('express');
const router = express.Router();

// In-memory session storage (in production, use Redis or database)
const chatSessions = new Map();

// AI Service Configuration
const AI_CONFIG = {
  openai: {
    enabled: process.env.OPENAI_API_KEY ? true : false,
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-3.5-turbo'
  },
  gemini: {
    enabled: true,
    apiKey: process.env.GEMINI_API_KEY || 'AIzaSyDxEOxYFTVAyAvDLsZ1nLHOoQqWml_Lq_E',
    model: 'gemini-2.5-flash'
  }
};

// Middleware to handle session management
const getOrCreateSession = (req, res, next) => {
  const sessionId = req.headers['x-session-id'] || req.body.sessionId || 'default';

  if (!chatSessions.has(sessionId)) {
    chatSessions.set(sessionId, {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      userContext: {},
      failedServices: []
    });
  }

  req.session = chatSessions.get(sessionId);
  req.session.lastActivity = new Date();
  next();
};

// OpenAI API call
async function callOpenAI(messages, userContext) {
  if (!AI_CONFIG.openai.enabled) {
    throw new Error('OpenAI not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`
    },
    body: JSON.stringify({
      model: AI_CONFIG.openai.model,
      messages: [
        {
          role: 'system',
          content: `You are a professional financial advisor and portfolio assistant. Help users with investment advice, market analysis, and portfolio management. Keep responses concise and actionable. User context: ${JSON.stringify(userContext)}`
        },
        ...messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Gemini AI API call
async function callGemini(messages, userContext) {
  if (!AI_CONFIG.gemini.enabled) {
    throw new Error('Gemini not configured');
  }

  try {
    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({ apiKey: AI_CONFIG.gemini.apiKey });

    const prompt = `You are a professional financial advisor and portfolio assistant. Help users with investment advice, market analysis, and portfolio management. Keep responses concise and actionable.

User Context: ${JSON.stringify(userContext)}

Recent conversation:
${messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')}

Latest user message: ${messages[messages.length - 1]?.content}

Provide helpful financial advice:`;

    const response = await ai.models.generateContent({
      model: AI_CONFIG.gemini.model,
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

// Enhanced default portfolio responses with suggestions
function generateDefaultResponse(message, userContext = {}) {
  const msg = message.toLowerCase();

  // Greeting responses
  if (msg.match(/^(hi|hello|hey|good morning|good afternoon|good evening)$/i)) {
    return {
      message: "🌟 Hello! I'm your AI portfolio advisor. I can help you with investment strategies, market analysis, and portfolio management. What would you like to explore today?",
      suggestions: ["📊 Analyze my portfolio", "💡 Stock recommendations", "📈 Market trends", "🛡️ Risk management"]
    };
  }

  // Stock recommendations with market context
  if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('what to buy')) {
    return {
      message: "📈 **Smart Investment Picks:**\n\n• **Blue-chip stocks**: AAPL, MSFT, GOOGL for stability\n• **Growth sectors**: AI/Tech, Healthcare, Clean Energy\n• **Dividend champions**: JNJ, PG, KO for income\n• **Index funds**: VTI, SPY for diversification\n\n*Always research before investing!*",
      suggestions: ["🏭 Sector analysis", "💰 Dividend stocks", "🚀 Growth picks", "📋 Portfolio review"]
    };
  }

  // Investment advice
  if (msg.includes('invest') || msg.includes('buy') || msg.includes('purchase')) {
    return {
      message: "💡 **Investment Success Principles:**\n\n✅ **Diversify** across sectors and asset classes\n✅ **Dollar-cost average** to reduce timing risk\n✅ **Invest long-term** - time in market beats timing market\n✅ **Stay disciplined** - avoid emotional decisions",
      suggestions: ["📊 Diversification tips", "⚖️ Risk assessment", "📈 DCA calculator", "🎯 Goal setting"]
    };
  }

  // Market analysis
  if (msg.includes('market') || msg.includes('trend') || msg.includes('analysis')) {
    return {
      message: "📊 **Current Market Insights:**\n\n🎯 **Focus Areas**: Quality companies at reasonable prices\n⚠️ **Watch**: Economic indicators, Fed policy\n💪 **Opportunity**: Volatility creates buying chances\n🔍 **Strategy**: Stay informed, avoid market noise",
      suggestions: ["🏭 Sector performance", "📰 Market news", "📉 Volatility tips", "🎯 Entry points"]
    };
  }

  // Portfolio review
  if (msg.includes('portfolio') || msg.includes('holding') || msg.includes('review')) {
    const portfolioValue = userContext.value || '$0';
    return {
      message: `📋 **Portfolio Health Check:**\n\nCurrent Value: ${portfolioValue}\n\n🔄 **Rebalance** when positions drift >10%\n📊 **Diversify** across 8-15 quality stocks\n💸 **Monitor** expense ratios and fees\n📈 **Review** quarterly, not daily`,
      suggestions: ["⚖️ Rebalancing guide", "📊 Performance metrics", "💰 Tax strategies", "🎯 Allocation tips"]
    };
  }

  // Risk management
  if (msg.includes('risk') || msg.includes('safe') || msg.includes('protect')) {
    return {
      message: "🛡️ **Risk Management Essentials:**\n\n🎯 **Position sizing**: Max 5-10% per stock\n💰 **Emergency fund**: 3-6 months expenses\n📉 **Stop-losses**: Protect against major drops\n🏦 **Defensive sectors**: Utilities, healthcare during uncertainty",
      suggestions: ["📊 Risk calculator", "🎯 Position sizing", "🛡️ Hedging strategies", "💰 Emergency fund"]
    };
  }

  // News and updates
  if (msg.includes('news') || msg.includes('update') || msg.includes('gainer') || msg.includes('performer')) {
    return {
      message: "📰 **Market Updates & Top Performers:**\n\n🚀 **Today's Leaders**: Tech, Healthcare leading\n📈 **Momentum**: Quality growth stocks outperforming\n⚠️ **Caution**: Don't chase performance blindly\n🔍 **Focus**: Fundamentals over short-term moves",
      suggestions: ["📈 Top gainers", "📰 Latest news", "🏭 Sector leaders", "📊 Market movers"]
    };
  }

  // Stock-specific queries
  if (msg.includes('stock') || msg.includes('ticker')) {
    return {
      message: "📊 **Stock Analysis Framework:**\n\n✅ **Fundamentals**: P/E, debt levels, growth rates\n✅ **Technical**: Support/resistance, trends\n✅ **Qualitative**: Competitive moats, management\n✅ **Valuation**: Fair value vs current price",
      suggestions: ["🔍 Stock screener", "📈 Technical analysis", "💰 Valuation tools", "📋 Watchlist"]
    };
  }

  // Default comprehensive response
  return {
    message: "💬 **I'm your AI Portfolio Advisor!**\n\nI can help you with:\n📊 Portfolio analysis & optimization\n💡 Stock recommendations & research\n📈 Market insights & trends\n🛡️ Risk management strategies\n💰 Investment education\n\n*What would you like to explore?*",
    suggestions: ["📊 Portfolio analysis", "💡 Investment ideas", "📈 Market updates", "🛡️ Risk assessment", "📚 Learn investing"]
  };
}

/**
 * POST /api/chat/message
 * Send a message with multi-AI fallback system
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

    let responseMessage;
    let aiService = 'default';
    let isAIResponse = false;

    // Try OpenAI first
    if (AI_CONFIG.openai.enabled && !req.session.failedServices.includes('openai')) {
      try {
        console.log('🔄 Attempting OpenAI...');
        responseMessage = await callOpenAI(req.session.messages, req.session.userContext);
        aiService = 'openai';
        isAIResponse = true;
        console.log('✅ OpenAI response generated');
      } catch (error) {
        console.log('❌ OpenAI failed:', error.message);
        req.session.failedServices.push('openai');
      }
    }

    // Try Gemini if OpenAI failed
    if (!isAIResponse && AI_CONFIG.gemini.enabled && !req.session.failedServices.includes('gemini')) {
      try {
        console.log('🔄 Attempting Gemini AI...');
        responseMessage = await callGemini(req.session.messages, req.session.userContext);
        aiService = 'gemini';
        isAIResponse = true;
        console.log('✅ Gemini AI response generated');
      } catch (error) {
        console.log('❌ Gemini AI failed:', error.message);
        req.session.failedServices.push('gemini');
      }
    }

    // Fallback to enhanced default responses
    if (!isAIResponse) {
      console.log('🔄 Using enhanced default response system...');
      const defaultResponse = generateDefaultResponse(userMessage, req.session.userContext);
      responseMessage = defaultResponse.message;

      // Add response to session history
      req.session.messages.push({
        role: 'assistant',
        content: responseMessage,
        timestamp: new Date().toISOString(),
        service: 'default',
        suggestions: defaultResponse.suggestions
      });

      // Reset failed services after some time (optional)
      if (req.session.failedServices.length > 0) {
        setTimeout(() => {
          req.session.failedServices = [];
          console.log('🔄 AI services reset for retry');
        }, 300000); // Reset after 5 minutes
      }

      return res.json({
        success: true,
        message: responseMessage,
        suggestions: defaultResponse.suggestions,
        sessionId: req.session.id,
        service: 'default',
        isAIResponse: false,
        timestamp: new Date().toISOString(),
        fallbackChain: ['OpenAI ❌', 'Gemini ❌', 'Default ✅']
      });
    }

    // Add AI response to session history
    req.session.messages.push({
      role: 'assistant',
      content: responseMessage,
      timestamp: new Date().toISOString(),
      service: aiService
    });

    // Keep only last 20 messages
    if (req.session.messages.length > 20) {
      req.session.messages = req.session.messages.slice(-20);
    }

    res.json({
      success: true,
      message: responseMessage,
      sessionId: req.session.id,
      service: aiService,
      isAIResponse: true,
      timestamp: new Date().toISOString(),
      fallbackChain: aiService === 'openai' ? ['OpenAI ✅'] : ['OpenAI ❌', 'Gemini ✅']
    });

  } catch (error) {
    console.error('Chat message error:', error);

    const fallbackResponse = generateDefaultResponse("help", req.session?.userContext || {});

    res.status(200).json({
      success: true,
      message: fallbackResponse.message,
      suggestions: fallbackResponse.suggestions,
      sessionId: req.session?.id || 'unknown',
      service: 'default',
      isAIResponse: false,
      timestamp: new Date().toISOString(),
      fallbackChain: ['OpenAI ❌', 'Gemini ❌', 'Default ✅']
    });
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
    req.session.failedServices = [];

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
 * Check all AI services status
 */
router.get('/status', async (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    services: {
      openai: AI_CONFIG.openai.enabled ? 'available' : 'disabled',
      gemini: AI_CONFIG.gemini.enabled ? 'available' : 'disabled',
      defaultResponses: 'available',
      sessions: chatSessions.size
    },
    fallbackChain: ['OpenAI', 'Gemini AI', 'Enhanced Default Responses'],
    note: 'System will automatically try each service in order until one succeeds'
  });
});

module.exports = router;
