/**
 * Portfolio AI Chatbot – Professional Advisor
 * Single-file frontend implementation
 */

class PortfolioChatbot {
  constructor() {
    this.isOpen = false;
    this.isTyping = false;
    this.isOnline = false;
    this.sessionId = this.createSessionId();
    this.API_BASE_URL = '/api/chat';

    /* ================= OPENAI PROMPT ================= */

    this.OPENAI_SYSTEM_PROMPT = `
You are a professional investment advisor.

Guidelines:
- Sound like a human financial advisor, not an AI.
- Be calm, concise, and practical.
- No hype, no guarantees.
- Focus on diversification, risk management, and long-term investing.
- If unsure, provide principle-based guidance.
`;

    /* ================= DOM ================= */

    this.chatToggle = document.getElementById('chatToggle');
    this.chatContainer = document.getElementById('chatbotContainer');
    this.chatMessages = document.getElementById('chatMessages');
    this.chatInput = document.getElementById('chatInput');
    this.chatSendButton = document.getElementById('chatSendButton');
    this.chatTyping = document.getElementById('chatTyping');

    this.bindEvents();
    this.checkServiceStatus();
  }

  /* ================= INIT ================= */

  createSessionId() {
    return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  bindEvents() {
    this.chatInput?.addEventListener('input', e => {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
    });
  }

  async checkServiceStatus() {
    try {
      const res = await fetch(`${this.API_BASE_URL}/status`);
      const data = await res.json();

      // Determine if any AI service is available
      const hasAIService = data.services.openai === 'available' || data.services.gemini === 'available';

      this.isOnline = hasAIService;
      this.updateStatusLight(hasAIService ? 'ai-available' : 'default-only');

      // Show appropriate welcome message
      if (hasAIService) {
        this.showWelcome();
      } else {
        this.showOfflineWelcome();
      }
    } catch (error) {
      console.error('Service status check failed:', error);
      this.isOnline = false;
      this.updateStatusLight('default-only');
      this.showOfflineWelcome();
    }
  }

  updateStatusLight(state) {
    const light = document.getElementById('statusLight');
    const text = document.getElementById('statusText');
    if (!light || !text) return;

    switch (state) {
      case 'ai-available':
        light.style.background = '#10b981';
        light.style.boxShadow = '0 0 12px rgba(16,185,129,0.6)';
        text.textContent = 'AI Assistant Ready';
        break;
      case 'default-only':
        light.style.background = '#f59e0b';
        light.style.boxShadow = '0 0 12px rgba(245,158,11,0.6)';
        text.textContent = 'Smart Assistant';
        break;
      case 'offline':
      default:
        light.style.background = '#ef4444';
        light.style.boxShadow = '0 0 12px rgba(239,68,68,0.6)';
        text.textContent = 'Assistant Offline';
        break;
    }
  }

  /* ================= UI ================= */

  toggleChatbot() {
    this.isOpen = !this.isOpen;
    this.chatContainer.style.display = this.isOpen ? 'flex' : 'none';
    this.chatToggle.style.bottom = this.isOpen ? '620px' : '24px';
    this.isOpen && this.chatInput?.focus();
  }

  showTyping() {
    this.isTyping = true;
    this.chatTyping.style.display = 'flex';
    this.chatSendButton.disabled = true;
  }

  hideTyping() {
    this.isTyping = false;
    this.chatTyping.style.display = 'none';
    this.chatSendButton.disabled = false;
  }

  scrollBottom() {
    setTimeout(() => {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }, 50);
  }

  /* ================= MESSAGE RENDER ================= */

  addMessage(text, isUser = false, isFallback = false) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.marginBottom = '14px';
    wrapper.style.justifyContent = isUser ? 'flex-end' : 'flex-start';

    const bubble = document.createElement('div');
    bubble.style.maxWidth = '280px';
    bubble.style.padding = '12px 16px';
    bubble.style.borderRadius = '14px';
    bubble.style.fontSize = '14px';
    bubble.style.lineHeight = '1.5';

    if (isUser) {
      // RIGHT SIDE – USER
      bubble.style.background = 'linear-gradient(135deg,#3b82f6,#6366f1)';
      bubble.style.color = '#fff';
      bubble.style.borderBottomRightRadius = '4px';
      bubble.innerHTML = this.escape(text);
    } else {
      // LEFT SIDE – ADVISOR
      bubble.style.background = isFallback ? '#fff7ed' : '#f8fafc';
      bubble.style.color = '#1e293b';
      bubble.style.border = isFallback ? '1px solid #fdba74' : '1px solid #e2e8f0';
      bubble.style.borderBottomLeftRadius = '4px';
      bubble.innerHTML = this.format(text);
    }

    wrapper.appendChild(bubble);
    this.chatMessages.appendChild(wrapper);
    this.scrollBottom();
  }

  /* ================= CONTEXT ================= */

  getPortfolioContext() {
    return {
      value: document.getElementById('totalValue')?.textContent || '$0.00',
      pnl: document.getElementById('totalGainLoss')?.textContent || '$0.00'
    };
  }

  /* ================= KEYWORD-BASED DEFAULT RESPONSES ================= */

  getKeywordResponse(message) {
    const msg = message.toLowerCase();
    const ctx = this.getPortfolioContext();

    // Greeting responses
    if (msg.match(/^(hi|hello|hey|good morning|good afternoon|good evening)$/i)) {
      setTimeout(() => {
        this.addSuggestions([
          '📈 Stock Recommendations',
          '🔥 Top Gainers Today',
          '📰 Market News',
          '💼 Portfolio Analysis',
          '📊 Risk Assessment'
        ]);
      }, 500);
      return `Hello! I'm your portfolio advisor. How can I help you today?`;
    }

    // How are you responses
    if (msg.match(/(how are you|how's it going|what's up)/i)) {
      return `I'm doing well, thank you! Ready to help you with your investment decisions. What would you like to discuss about your portfolio?`;
    }

    // Stock-related queries
    if (msg.includes('stock') || msg.includes('recommend')) {
      setTimeout(() => {
        this.addSuggestions([
          '💎 Blue Chip Stocks',
          '🚀 Growth Stocks',
          '💰 Dividend Stocks',
          '🔍 Undervalued Picks'
        ]);
      }, 500);
      return `For stock selection, I recommend focusing on companies with strong fundamentals, consistent earnings growth, and competitive advantages. Consider diversifying across sectors and market caps.`;
    }

    // Investment advice
    if (msg.includes('invest') || msg.includes('buy') || msg.includes('purchase')) {
      return `A disciplined investment approach works best. Consider dollar-cost averaging for volatile markets and always align investments with your risk tolerance and time horizon.`;
    }

    // Market analysis
    if (msg.includes('market') || msg.includes('analysis')) {
      setTimeout(() => {
        this.addSuggestions([
          '📈 Market Trends',
          '🏛️ Sector Analysis',
          '⚠️ Risk Factors',
          '🎯 Price Targets'
        ]);
      }, 500);
      return `Current market conditions require careful analysis. Focus on quality companies trading at reasonable valuations. Diversification remains key in uncertain times.`;
    }

    // News and updates
    if (msg.includes('news') || msg.includes('update')) {
      return `Stay informed about earnings reports, economic indicators, and sector developments. Focus on news that affects your holdings' long-term prospects rather than daily market noise.`;
    }

    // Top gainers
    if (msg.includes('gainer') || msg.includes('performer') || msg.includes('winners')) {
      return `🚀 **Market Leaders & Top Performers:**\n\n📈 **Tech Giants**: AAPL, MSFT, GOOGL leading innovation\n⚡ **AI Stocks**: NVDA, AMD driving semiconductor gains\n🏥 **Healthcare**: JNJ, UNH showing defensive strength\n🏦 **Financials**: JPM, BAC benefiting from rates\n🔋 **Clean Tech**: TSLA, renewable energy momentum\n\n⚠️ **Remember**: Chase quality, not just performance`;
    }

    // Portfolio-specific advice
    if (msg.includes('portfolio') || msg.includes('holding')) {
      const totalValue = ctx.value.replace(/[^0-9.-]/g, '');
      if (parseFloat(totalValue) > 50000) {
        return `Your portfolio shows good size. Consider rebalancing quarterly and taking profits from overweight positions. Diversification across 15-25 quality stocks is often optimal.`;
      }
      return `For your portfolio size, focus on 8-12 high-conviction positions. Regular contributions and patience will compound your returns over time.`;
    }

    // Profit/loss management
    if (msg.includes('profit') || msg.includes('gain')) {
      return `In profitable positions, consider taking partial profits and letting winners run. A 25% profit-taking rule can help lock in gains while maintaining upside exposure.`;
    }

    if (msg.includes('loss') || msg.includes('down')) {
      return `Losses are part of investing. Review the fundamentals - if the thesis remains intact, consider averaging down. If not, cut losses and redeploy capital wisely.`;
    }

    // Risk management
    if (msg.includes('risk') || msg.includes('safe')) {
      return `Risk management is crucial. Never invest more than 5% in any single stock, maintain emergency funds, and diversify across sectors. Your risk capacity should match your investment timeline.`;
    }

    // Default contextual response
    if (ctx.pnl && ctx.pnl.includes('-')) {
      return `Given current market conditions affecting your portfolio, focus on capital preservation and selective opportunities. Avoid emotional decisions and stick to your investment plan.`;
    }

    // Generic helpful response
    return `I'm here to help with investment advice, market analysis, and portfolio management. Feel free to ask about specific stocks, market trends, or investment strategies.`;
  }

  /* ================= SUGGESTION BUTTONS ================= */

  addSuggestions(suggestions) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-suggestions';
    wrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 16px 0;
      padding: 16px;
      background: linear-gradient(135deg, #f8fafc, #e1f5fe);
      border: 1px solid #e3f2fd;
      border-left: 4px solid #1e88e5;
      border-radius: 12px;
      animation: slideUp 0.4s ease-out;
    `;

    const title = document.createElement('div');
    title.textContent = 'Quick Actions:';
    title.style.cssText = `
      font-size: 13px;
      font-weight: 600;
      color: #1e88e5;
      margin-bottom: 8px;
    `;
    wrapper.appendChild(title);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    `;

    suggestions.forEach(suggestion => {
      const button = document.createElement('button');
      button.textContent = suggestion;
      button.style.cssText = `
        background: #fff;
        border: 1px solid #e2e8f0;
        color: #475569;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      `;

      button.addEventListener('mouseenter', () => {
        button.style.background = 'linear-gradient(135deg, #1e88e5, #26c6da)';
        button.style.color = 'white';
        button.style.borderColor = '#1e88e5';
        button.style.transform = 'translateY(-1px)';
        button.style.boxShadow = '0 4px 12px rgba(30, 136, 229, 0.3)';
      });

      button.addEventListener('mouseleave', () => {
        button.style.background = '#fff';
        button.style.color = '#475569';
        button.style.borderColor = '#e2e8f0';
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      });

      button.addEventListener('click', () => {
        this.handleSuggestionClick(suggestion);
        wrapper.remove();
      });

      buttonContainer.appendChild(button);
    });

    wrapper.appendChild(buttonContainer);
    this.chatMessages.appendChild(wrapper);
    this.scrollBottom();
  }

  handleSuggestionClick(suggestion) {
    // Add user message
    this.addMessage(suggestion, true);

    // Generate contextual response
    let response = '';

    if (suggestion.includes('Stock Recommendations') || suggestion.includes('Investment ideas')) {
      response = `Here are some quality stocks to consider:\n\n• **MSFT** - Strong cloud growth and dividend yield\n• **GOOGL** - Dominant in search and AI development\n• **NVDA** - Leading AI chip manufacturer\n• **JPM** - Solid banking fundamentals\n• **JNJ** - Defensive healthcare play\n\nRemember to research each company's fundamentals before investing.`;
    } else if (suggestion.includes('Top Gainers') || suggestion.includes('Market updates')) {
      response = `Today's market highlights:\n\n📈 **Trending Sectors**: Technology, Healthcare, Clean Energy\n🚀 **Momentum Leaders**: AI & Semiconductor stocks\n⚖️ **Balanced Approach**: Mix growth with dividend stocks\n🔍 **Research Focus**: Companies with strong earnings growth\n\nAlways verify with current market data before trading.`;
    } else if (suggestion.includes('Market News') || suggestion.includes('Latest news')) {
      response = `Key market developments to watch:\n\n• **Fed Policy**: Monitor interest rate decisions\n• **Earnings Season**: Strong tech earnings driving growth\n• **Sector Rotation**: Value vs growth dynamics\n• **Economic Data**: Employment and inflation reports\n\nStay informed but focus on long-term investment thesis.`;
    } else if (suggestion.includes('Portfolio Analysis') || suggestion.includes('Analyze my portfolio')) {
      const ctx = this.getPortfolioContext();
      response = `📊 **Portfolio Health Check:**\n\nCurrent Value: ${ctx.value}\nP&L: ${ctx.pnl}\n\n✅ **Review Points:**\n• Position sizing (max 10% per stock)\n• Sector diversification balance\n• Risk-adjusted returns\n• Rebalancing opportunities\n\n**Recommendation**: Maintain disciplined approach with regular reviews.`;
    } else if (suggestion.includes('Risk Assessment') || suggestion.includes('Risk management')) {
      response = `🛡️ **Risk Management Checklist:**\n\n✅ **Position Sizing**: Never more than 5-10% in single stock\n✅ **Diversification**: Spread across 8-15 quality companies\n✅ **Emergency Fund**: Maintain 3-6 months expenses\n✅ **Stop Losses**: Consider for volatile positions\n✅ **Regular Review**: Monthly portfolio assessment\n\nYour risk tolerance should match your investment timeline.`;
    } else if (suggestion.includes('Blue Chip') || suggestion.includes('Dividend stocks')) {
      response = `💰 **Blue Chip & Dividend Champions:**\n\n**Stable Dividend Payers:**\n• **JNJ** - Healthcare leader, 60+ years of increases\n• **PG** - Consumer staples, consistent performer\n• **KO** - Global brand, reliable income\n• **VZ** - Telecom utility, high yield\n• **MSFT** - Tech dividend aristocrat\n\nThese provide steady income and potential capital appreciation.`;
    } else if (suggestion.includes('Growth Stocks') || suggestion.includes('Growth picks')) {
      response = `🚀 **Growth Stock Opportunities:**\n\n**High-Growth Potential:**\n• **NVDA** - AI & semiconductor leader\n• **GOOGL** - Search dominance + AI innovation\n• **AMZN** - Cloud computing & e-commerce\n• **TSLA** - EV market pioneer\n• **AAPL** - Premium tech ecosystem\n\n⚠️ **Note**: Higher volatility, limit to 20-30% of portfolio.`;
    } else if (suggestion.includes('Sector analysis') || suggestion.includes('Sector performance')) {
      response = `🏭 **Sector Performance Analysis:**\n\n📊 **Strong Performers:**\n• Technology: AI, Cloud, Semiconductors\n• Healthcare: Biotech, Medical devices\n• Financials: Banks benefiting from rates\n\n⚖️ **Balanced Approach:**\n• Consumer Discretionary: Selective picks\n• Energy: Commodity cycle plays\n• Utilities: Defensive positioning\n\nDiversify across sectors for optimal risk management.`;
    } else if (suggestion.includes('Learn investing') || suggestion.includes('Educational')) {
      response = `📚 **Investment Education Essentials:**\n\n**Core Principles:**\n• Start with index funds for broad exposure\n• Understand risk vs return relationship\n• Time in market beats timing the market\n• Dollar-cost averaging reduces volatility\n• Never invest borrowed money\n\n**Next Steps:**\n• Read annual reports of companies you own\n• Follow reputable financial news sources\n• Practice with small amounts initially`;
    } else {
      response = `I'd be happy to provide more specific guidance. What aspect of investing would you like to explore further?`;
    }

    setTimeout(() => {
      this.addMessage(response, false);
    }, 800);
  }

  /* ================= MESSAGE FLOW ================= */

  async sendMessage() {
    const text = this.chatInput.value.trim();
    if (!text || this.isTyping) return;

    this.addMessage(text, true);
    this.chatInput.value = '';
    this.chatInput.style.height = 'auto';

    // Show typing indicator
    this.showTyping();

    try {
      const res = await fetch(`${this.API_BASE_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': this.sessionId
        },
        body: JSON.stringify({
          message: text,
          userContext: this.getPortfolioContext()
        })
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();

      // Update status based on AI service used
      this.updateAIServiceStatus(data.service, data.isAIResponse);

      // Add the response message
      this.addMessage(data.message, false, !data.isAIResponse);

      // Add suggestions if available
      if (data.suggestions && data.suggestions.length > 0) {
        setTimeout(() => {
          this.addSuggestions(data.suggestions);
        }, 500);
      }

      // Log fallback chain for debugging
      if (data.fallbackChain) {
        console.log('AI Fallback Chain:', data.fallbackChain);
      }

    } catch (error) {
      console.error('Chat error:', error);
      // Fallback to local keyword response
      const fallbackResponse = this.getKeywordResponse(text);
      this.addMessage(fallbackResponse, false, true);
      this.updateAIServiceStatus('default', false);
    } finally {
      this.hideTyping();
    }
  }

  // Update AI service status indicator
  updateAIServiceStatus(service, isAI) {
    const statusLight = document.getElementById('statusLight');
    const statusText = document.getElementById('statusText');

    if (!statusLight || !statusText) return;

    switch (service) {
      case 'openai':
        statusLight.style.background = '#10b981';
        statusLight.style.boxShadow = '0 0 12px rgba(16,185,129,0.6)';
        statusText.textContent = 'OpenAI Online';
        break;
      case 'gemini':
        statusLight.style.background = '#3b82f6';
        statusLight.style.boxShadow = '0 0 12px rgba(59,130,246,0.6)';
        statusText.textContent = 'Gemini AI Online';
        break;
      case 'default':
      default:
        statusLight.style.background = '#f59e0b';
        statusLight.style.boxShadow = '0 0 12px rgba(245,158,11,0.6)';
        statusText.textContent = 'Smart Assistant';
        break;
    }
  }

  /* ================= HELPERS ================= */

  escape(text) {
    return text.replace(/[<>&"]/g, m => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[m]);
  }

  format(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  /* ================= WELCOME MESSAGES ================= */

  showWelcome() {
    setTimeout(() => {
      this.addMessage('🌟 Hello! I\'m your AI-powered portfolio advisor with access to multiple intelligence systems. I can provide real-time investment insights, market analysis, and personalized recommendations. How can I help you today?', false);
      setTimeout(() => {
        this.addSuggestions([
          '📊 Analyze my portfolio',
          '💡 Stock recommendations',
          '📈 Market trends',
          '🛡️ Risk assessment'
        ]);
      }, 800);
    }, 1000);
  }

  showOfflineWelcome() {
    setTimeout(() => {
      this.addMessage('🤖 Hello! I\'m currently using my smart knowledge base to assist you. While AI services may be limited, I can still provide valuable investment guidance, portfolio insights, and help you navigate the dashboard features. What would you like to explore?', false, true);
      setTimeout(() => {
        this.addSuggestions([
          '📋 Portfolio overview',
          '💰 Investment basics',
          '📊 Dashboard help',
          '🎯 Goal setting'
        ]);
      }, 800);
    }, 1000);
  }

  clearChat() {
    this.chatMessages.innerHTML = '';
  }
}

/* ================= GLOBAL ================= */

let portfolioChatbot;

window.initializeChatbot = () => {
  portfolioChatbot = new PortfolioChatbot();
};

window.toggleChatbot = () => portfolioChatbot?.toggleChatbot();
window.sendMessage = () => portfolioChatbot?.sendMessage();
window.handleChatKeyPress = e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    portfolioChatbot?.sendMessage();
  }
};

window.clearChat = () => {
  if (portfolioChatbot) {
    portfolioChatbot.clearChat();
    portfolioChatbot.showOfflineWelcome();
  }
};
