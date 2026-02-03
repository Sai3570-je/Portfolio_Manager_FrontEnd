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
      this.isOnline = !data.fallbackMode;
      this.updateStatusLight(this.isOnline ? 'online' : 'offline');
      this.showWelcome();
    } catch {
      this.isOnline = false;
      this.updateStatusLight('offline');
      this.showOfflineWelcome();
    }
  }

  updateStatusLight(state) {
    const light = document.getElementById('statusLight');
    const text = document.getElementById('statusText');
    if (!light) return;

    if (state === 'online') {
      light.style.background = '#10b981';
      text && (text.textContent = 'Advisor Online');
    } else {
      light.style.background = '#ef4444';
      text && (text.textContent = 'Offline Advisor');
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

    if (msg.includes('stock')) {
      return `When selecting stocks, focus on business quality, balance sheet strength, and long-term growth potential rather than short-term price movement.`;
    }

    if (msg.includes('invest')) {
      return `A disciplined investment approach works best. Gradual deployment of capital and diversification across assets help manage risk effectively.`;
    }

    if (msg.includes('suggest')) {
      return `From an advisory standpoint, it’s better to align suggestions with your risk tolerance and investment horizon before acting.`;
    }

    if (msg.includes('profit')) {
      return `In profitable positions, consider partial profit booking and portfolio rebalancing instead of exiting entirely.`;
    }

    if (msg.includes('loss')) {
      return `Losses are part of investing. Focus on fundamentals and avoid emotional decisions unless the original investment thesis has changed.`;
    }

    if (msg.includes('market')) {
      return `Markets move in cycles. Staying diversified and maintaining a long-term perspective is more important than reacting to daily volatility.`;
    }

    if (ctx.pnl.includes('-')) {
      return `Given current portfolio pressure, capital protection and selective accumulation should take priority over aggressive positioning.`;
    }

    return `A well-structured portfolio built around diversification, discipline, and patience tends to perform better over long investment horizons.`;
  }

  /* ================= MESSAGE FLOW ================= */

  async sendMessage() {
    const text = this.chatInput.value.trim();
    if (!text || this.isTyping) return;

    this.addMessage(text, true);
    this.chatInput.value = '';
    this.chatInput.style.height = 'auto';

    // OFFLINE OR FALLBACK
    if (!this.isOnline) {
      this.addMessage(this.getKeywordResponse(text), false, true);
      return;
    }

    // ONLINE (AI)
    this.showTyping();

    try {
      const res = await fetch(`${this.API_BASE_URL}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          systemPrompt: this.OPENAI_SYSTEM_PROMPT,
          userMessage: text,
          portfolioContext: this.getPortfolioContext()
        })
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      this.addMessage(data.message || this.getKeywordResponse(text));
    } catch {
      this.isOnline = false;
      this.updateStatusLight('offline');
      this.addMessage(this.getKeywordResponse(text), false, true);
    } finally {
      this.hideTyping();
    }
  }

  /* ================= WELCOME ================= */

  showWelcome() {
    this.addMessage(
      `Welcome. I’ll assist you with investment decisions based on portfolio structure, risk management, and long-term market behavior.`
    );
  }

  showOfflineWelcome() {
    this.addMessage(
      `I’m currently offline, but I can still guide you using professional investment principles.`,
      false,
      true
    );
  }

  /* ================= UTILS ================= */

  format(text) {
    return text.replace(/\n/g, '<br>');
  }

  escape(text) {
    return text.replace(/[&<>"]/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])
    );
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
