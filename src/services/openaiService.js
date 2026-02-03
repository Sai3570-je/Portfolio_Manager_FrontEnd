/**
 * OpenAI Service - AI Chatbot Integration with Fallback Handling
 * Handles OpenAI API communication with comprehensive error handling
 */

const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
    this.fallbackMessages = [
      "I'm having trouble connecting right now. Please try again in a moment.",
      "The service is temporarily unavailable, but your portfolio looks stable. Consider reviewing long-term goals.",
      "Market data is unavailable at the moment. You can still explore your portfolio overview.",
      "Something went wrong on our side. Please retry after a few seconds.",
      "I'm currently offline, but I'm here to help! Try refreshing the page or check back soon.",
      "Experiencing technical difficulties. Your portfolio data remains secure and accessible.",
      "Connection temporarily lost. In the meantime, consider diversifying your investments.",
      "Service interruption detected. Your trading history and portfolio are still available in other sections."
    ];

    // Enhanced fallback responses for common queries
    this.smartFallbackResponses = {
      greetings: [
        "Hi there! I'm currently in offline mode, but I can still help you navigate your portfolio. What would you like to know?",
        "Hello! While I'm temporarily offline, your portfolio data is still accessible. How can I assist you today?",
        "Hey! I'm running in limited mode right now, but I can still provide some guidance. What's on your mind?"
      ],
      portfolio: [
        "I'm currently offline, but I can see your portfolio is loaded in the dashboard. Check out your holdings and performance charts above!",
        "While my AI features are temporarily unavailable, you can still view your portfolio performance, add new positions, and analyze your holdings using the main dashboard.",
        "I'm in offline mode, but your portfolio data shows you have several positions. Consider reviewing your asset allocation and rebalancing if needed."
      ],
      market: [
        "I can't access live market data right now, but you can check the market movers section above for the latest trends.",
        "Market data services are temporarily unavailable, but your portfolio dashboard shows recent performance. Focus on your long-term investment strategy.",
        "While I'm offline, remember that market volatility is normal. Stay focused on your investment goals and consider dollar-cost averaging."
      ],
      advice: [
        "I'm currently in offline mode, but here's some timeless advice: diversify your portfolio, invest regularly, and think long-term.",
        "While my AI is offline, remember these principles: don't panic during market dips, maintain an emergency fund, and review your goals regularly.",
        "I can't provide personalized advice right now, but always remember to invest only what you can afford to lose and do your own research."
      ],
      general: [
        "I'm temporarily offline, but your portfolio dashboard has all the tools you need to manage your investments.",
        "While my AI features are limited, you can still add positions, view performance, and access market data through the main interface.",
        "I'm running in fallback mode. For complex questions, please try again later or consult with a financial advisor."
      ]
    };

    this.initializeClient();
  }

  initializeClient() {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.warn('OpenAI API key not found. Chatbot will use fallback messages.');
        return;
      }

      this.client = new OpenAI({
        apiKey: apiKey,
        timeout: 10000, // 10 second timeout
      });

      this.isInitialized = true;
      console.log('OpenAI service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OpenAI service:', error);
      this.isInitialized = false;
    }
  }

  getFallbackMessage(userMessage = '') {
    const message = userMessage.toLowerCase();

    // Determine message category and provide contextual responses
    let responseCategory = 'general';

    if (message.includes('hi') || message.includes('hello') || message.includes('hey') || message.includes('good')) {
      responseCategory = 'greetings';
    } else if (message.includes('portfolio') || message.includes('holding') || message.includes('stock') || message.includes('position')) {
      responseCategory = 'portfolio';
    } else if (message.includes('market') || message.includes('price') || message.includes('trend') || message.includes('data')) {
      responseCategory = 'market';
    } else if (message.includes('advice') || message.includes('recommend') || message.includes('suggest') || message.includes('should')) {
      responseCategory = 'advice';
    }

    const responses = this.smartFallbackResponses[responseCategory] || this.smartFallbackResponses.general;
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      message: selectedResponse,
      isFallback: true,
      timestamp: new Date().toISOString(),
      category: responseCategory
    };
  }

  buildSystemPrompt(userPortfolio = null, marketConditions = null) {
    let systemPrompt = `You are an AI financial assistant for a portfolio management application. You help users with:

1. Portfolio analysis and recommendations
2. Market insights and trends
3. Investment strategies and risk management
4. Financial planning and goal setting
5. Stock research and analysis

Guidelines:
- Be helpful, professional, and conversational
- Provide actionable financial advice when appropriate
- Always remind users that this is not professional financial advice
- Be concise but informative
- Use emojis sparingly for a friendly tone
- If you don't have specific market data, acknowledge it but still provide valuable general insights

Current context:`;

    if (userPortfolio) {
      systemPrompt += `\nUser's Portfolio: ${JSON.stringify(userPortfolio)}`;
    }

    if (marketConditions) {
      systemPrompt += `\nMarket Conditions: ${JSON.stringify(marketConditions)}`;
    }

    systemPrompt += `\n\nRemember to always include a disclaimer that this is not professional financial advice and users should do their own research or consult with financial advisors for major decisions.`;

    return systemPrompt;
  }

  async sendMessage(userMessage, conversationHistory = [], userContext = null) {
    try {
      // Check if service is available
      if (!this.isInitialized || !this.client) {
        console.log('OpenAI service not initialized, using fallback');
        return this.getFallbackMessage(userMessage);
      }

      // Build conversation messages
      const messages = [
        {
          role: 'system',
          content: this.buildSystemPrompt(userContext?.portfolio, userContext?.marketConditions)
        }
      ];

      // Add conversation history (limit to last 10 messages for context)
      const recentHistory = conversationHistory.slice(-10);
      messages.push(...recentHistory);

      // Add current user message
      messages.push({
        role: 'user',
        content: userMessage
      });

      console.log('Sending request to OpenAI API...');

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        timeout: 10000
      });

      if (!response || !response.choices || response.choices.length === 0) {
        throw new Error('Invalid response from OpenAI API');
      }

      const aiMessage = response.choices[0].message.content.trim();

      if (!aiMessage) {
        throw new Error('Empty response from OpenAI API');
      }

      return {
        message: aiMessage,
        isFallback: false,
        timestamp: new Date().toISOString(),
        model: 'gpt-3.5-turbo',
        tokensUsed: response.usage?.total_tokens || 0
      };

    } catch (error) {
      console.error('OpenAI API error:', error);

      // Log specific error details for monitoring
      const errorDetails = {
        message: error.message,
        code: error.code,
        type: error.type,
        status: error.status,
        timestamp: new Date().toISOString(),
        userMessage: userMessage.substring(0, 100) // Log first 100 chars for debugging
      };

      console.error('Detailed error info:', errorDetails);

      // Return smart fallback message based on user input
      return this.getFallbackMessage(userMessage);
    }
  }

  async validateConnection() {
    try {
      if (!this.isInitialized || !this.client) {
        return false;
      }

      // Simple test request
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
        timeout: 5000
      });

      return response && response.choices && response.choices.length > 0;
    } catch (error) {
      console.error('OpenAI connection validation failed:', error);
      return false;
    }
  }
}

module.exports = new OpenAIService();
