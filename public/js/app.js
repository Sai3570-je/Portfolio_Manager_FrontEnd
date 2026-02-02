/**
 * Portfolio Manager - Enhanced JavaScript Application (with i18n + Currency)
 * Features: Demo data rendering, charts, language toggle (en/hi/mr/te), currency toggle (USD/INR/AED)
 */

const API_BASE_URL = '/api/portfolio';

// i18n + Currency preferences and resources
const appPrefs = {
  locale: 'en', // 'en' | 'hi' | 'mr' | 'te'
  currency: 'USD', // 'USD' | 'INR' | 'AED'
};

const CURRENCIES = {
  USD: { symbol: '$', locale: 'en-US', rateFromUSD: 1 },
  INR: { symbol: '₹', locale: 'en-IN', rateFromUSD: 83 },
  AED: { symbol: 'د.إ', locale: 'en-AE', rateFromUSD: 3.67 },
};

const I18N_DICT = {
  hi: {
    'Dashboard': 'डैशबोर्ड',
    'My Portfolio': 'मेरा पोर्टफोलियो',
    'Orders': 'ऑर्डर',
    'Watchlist': 'वॉचलिस्ट',
    'Market Data': 'बाज़ार डेटा',
    'Transactions': 'लेन-देन',
    'Analysis': 'विश्लेषण',
    'Reports': 'रिपोर्ट्स',
    'Settings': 'सेटिंग्स',
    'Help & Support': 'सहायता और समर्थन',
    'Market Open': 'बाज़ार खुला',
    'Top Stock Gainers': 'शीर्ष स्टॉक बढ़त',
    'Refresh': 'रिफ्रेश',
    'Top Market Movers': 'शीर्ष बाज़ार मूवर्स',
    'Top Gainers': 'शीर्ष बढ़त',
    'Top Losers': 'शीर्ष गिरावट',
    'Sectors Trending Today': 'आज के ट्रेंडिंग सेक्टर्स',
    'Portfolio Performance': 'पोर्टफोलियो प्रदर्शन',
    'Asset Allocation': 'एसेट आवंटन',
    'Stocks in News Today': 'आज खबरों में स्टॉक',
    'Live Market Data': 'लाइव बाज़ार डेटा',
    'Portfolio Holdings': 'पोर्टफोलियो होल्डिंग्स',
    'Add Position': 'पोज़ीशन जोड़ें',
    'API Documentation': 'API दस्तावेज़',
    'Open Swagger UI': 'Swagger UI खोलें',
    'Your Investment': 'आपका निवेश',
    'Total Portfolio Value': 'कुल पोर्टफोलियो मूल्य',
    'Total Investment': 'कुल निवेश',
    'Total Gain/Loss': 'कुल लाभ/हानि',
    'Holdings': 'होल्डिंग्स',
    'Active positions': 'सक्रिय पोज़ीशन',
    'Original capital invested': 'मूल लगाई पूँजी',
    'Overall performance': 'कुल प्रदर्शन',
    'Search stocks, portfolios...': 'स्टॉक्स, पोर्टफोलियो खोजें...'
  },
  mr: {
    'Dashboard': 'डॅशबोर्ड',
    'My Portfolio': 'माझे पोर्टफोलिओ',
    'Orders': 'ऑर्डर्स',
    'Watchlist': 'वॉचलिस्ट',
    'Market Data': 'बाजार डेटा',
    'Transactions': 'व्यवहार',
    'Analysis': 'विश्लेषण',
    'Reports': 'अहवाल',
    'Settings': 'सेटिंग्स',
    'Help & Support': 'मदत आणि समर्थन',
    'Market Open': 'बाजार खुले',
    'Top Stock Gainers': 'टॉप स्टॉक वाढ',
    'Refresh': 'रिफ्रेश',
    'Top Market Movers': 'टॉप मार्केट मूव्हर्स',
    'Top Gainers': 'टॉप गेनर्स',
    'Top Losers': 'टॉप लूजर्स',
    'Sectors Trending Today': 'आज ट्रेंडिंग सेक्टर्स',
    'Portfolio Performance': 'पोर्टफोलिओ परफॉर्मन्स',
    'Asset Allocation': 'अॅसेट वाटप',
    'Stocks in News Today': 'आजच्या बातम्यांतील स्टॉक्स',
    'Live Market Data': 'लाइव्ह बाजार डेटा',
    'Portfolio Holdings': 'पोर्टफोलिओ होल्डिंग्स',
    'Add Position': 'स्थिती जोडा',
    'API Documentation': 'API दस्तऐवजीकरण',
    'Open Swagger UI': 'Swagger UI उघडा',
    'Your Investment': 'तुमची गुंतवणूक',
    'Total Portfolio Value': 'एकूण पोर्टफोलिओ मूल्य',
    'Total Investment': 'एकूण गुंतवणूक',
    'Total Gain/Loss': 'एकूण नफा/तोटा',
    'Holdings': 'होल्डिंग्स',
    'Active positions': 'सक���रिय पोझिशन्स',
    'Original capital invested': 'मूळ गुंतवलेले भांडवल',
    'Overall performance': 'एकूण कामगिरी',
    'Search stocks, portfolios...': 'शेअर्स, पोर्टफोलिओ शोधा...'
  },
  te: {
    'Dashboard': 'డ్యాష్‌బోర్డ్',
    'My Portfolio': 'నా పోర్ట్‌ఫోలియో',
    'Orders': 'ఆర్డర్స్',
    'Watchlist': 'వాచ్‌లిస్ట్',
    'Market Data': 'మార్కెట్ డేటా',
    'Transactions': 'లావాదేవీలు',
    'Analysis': 'విశ్లేషణ',
    'Reports': 'రిపోర్ట్స్',
    'Settings': 'సెట్టింగ్స్',
    'Help & Support': 'సహాయం & మద్దతు',
    'Market Open': 'మార్కెట్ ఓపెన్',
    'Top Stock Gainers': 'టాప్ స్టాక్ గైనర్స్',
    'Refresh': 'రిఫ్రెష్',
    'Top Market Movers': 'టాప్ మార్కెట్ మూవర్స్',
    'Top Gainers': 'టాప్ గైనర్స్',
    'Top Losers': 'టాప్ ల���జర్స్',
    'Sectors Trending Today': 'ఈరోజు ట్రెండింగ్ రంగాలు',
    'Portfolio Performance': 'పోర్ట్‌ఫోలియో పనితీరు',
    'Asset Allocation': 'ఆస్తుల కేటాయింపు',
    'Stocks in News Today': 'ఈరోజు వార్తల్లో స్టాక్స్',
    'Live Market Data': 'లైవ్ మార్కెట్ డేటా',
    'Portfolio Holdings': 'పోర్ట్‌ఫోలియో హోల్డింగ్స్',
    'Add Position': 'స్థానాన్ని జోడించండి',
    'API Documentation': 'API డాక్యుమెంటేషన్',
    'Open Swagger UI': 'Swagger UI తెరవండి',
    'Your Investment': 'మీ పెట్టుబడి',
    'Total Portfolio Value': 'మొత్తం పోర్ట్‌ఫోలియో విలువ',
    'Total Investment': 'మొత్తం పెట్టుబడి',
    'Total Gain/Loss': 'మొత్తం లాభం/నష్టం',
    'Holdings': 'హోల్డింగ్స్',
    'Active positions': 'సక్రియ స్థానాలు',
    'Original capital invested': 'ప్రారంభ పెట్టుబడి',
    'Overall performance': 'మొత్తం పనితీరు',
    'Search stocks, portfolios...': 'స్టాక్స్, పోర్ట్‌ఫోలియోలు శోధించండి...'
  }
};

function t(str) {
  const dict = I18N_DICT[appPrefs.locale] || {};
  return dict[str] || str;
}

function applyTranslations() {
  const candidates = document.querySelectorAll('span, h1, h2, h3, button, a, label, p, th');
  candidates.forEach(el => {
    if (!el.dataset.origText) {
      el.dataset.origText = (el.textContent || '').trim();
    }
    const key = el.dataset.origText;
    const dict = I18N_DICT[appPrefs.locale] || {};
    if (appPrefs.locale === 'en') {
      el.textContent = el.dataset.origText;
    } else if (dict[key]) {
      el.textContent = dict[key];
    }
  });
  const search = document.getElementById('globalSearch');
  if (search) {
    if (!search.dataset.origPlaceholder) {
      search.dataset.origPlaceholder = search.placeholder || '';
    }
    const phKey = 'Search stocks, portfolios...';
    const translated = (I18N_DICT[appPrefs.locale] || {})[phKey];
    search.placeholder = appPrefs.locale === 'en' ? search.dataset.origPlaceholder : (translated || search.dataset.origPlaceholder);
  }
}

function setupI18nCurrencyUI() {
  const headerEl = document.querySelector('.main-panel header');
  if (!headerEl) return;
  const right = headerEl.children && headerEl.children[1];
  if (!right) return;

  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.alignItems = 'center';
  wrap.style.gap = '8px';

  const langSel = document.createElement('select');
  langSel.style.padding = '6px 8px';
  langSel.style.border = '1px solid #e2e8f0';
  langSel.style.borderRadius = '8px';
  ;(['en','hi','mr','te']).forEach(code => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = ({en:'EN',hi:'हिं',mr:'मरा',te:'తెల'}[code]);
    if (code === appPrefs.locale) opt.selected = true;
    langSel.appendChild(opt);
  });
  langSel.title = 'Language';

  const curSel = document.createElement('select');
  curSel.style.padding = '6px 8px';
  curSel.style.border = '1px solid #e2e8f0';
  curSel.style.borderRadius = '8px';
  ;(['USD','INR','AED']).forEach(code => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = `${CURRENCIES[code].symbol} ${code}`;
    if (code === appPrefs.currency) opt.selected = true;
    curSel.appendChild(opt);
  });
  curSel.title = 'Currency';

  langSel.addEventListener('change', () => {
    appPrefs.locale = langSel.value;
    applyTranslations();
  });

  curSel.addEventListener('change', () => {
    appPrefs.currency = curSel.value;
    updateAllCurrencyDisplays();
  });

  wrap.appendChild(langSel);
  wrap.appendChild(curSel);
  right.insertBefore(wrap, right.firstChild);
}

function updateAllCurrencyDisplays() {
  loadTopGainersSuggestions();
  loadTopMarketMovers();
  renderMarketData(demoMarketData);
  loadWatchlist();
  loadOrders();
  renderPortfolioTable(demoPortfolioData);
  updateYourInvestmentSummary();
  updateSummaryCards(calculatePortfolioSummary(demoPortfolioData));
  renderPerformanceChart(demoPortfolioData);
}

// Stock icons mapping with brand colors - ALL images included
const stockIcons = {
  'AAPL': { img: '/assets/images/AAPL.png', icon: 'fab', class: 'fa-apple', color: '#555555', bg: '#f5f5f7' },
  'GOOGL': { img: '/assets/images/GOOGL.png', icon: 'fab', class: 'fa-google', color: '#4285F4', bg: '#e8f0fe' },
  'GOOG': { img: '/assets/images/GOOGL.png', icon: 'fab', class: 'fa-google', color: '#4285F4', bg: '#e8f0fe' },
  'MSFT': { img: '/assets/images/MSFT.png', icon: 'fab', class: 'fa-microsoft', color: '#00A4EF', bg: '#e0f2ff' },
  'AMZN': { img: '/assets/images/AMZN.jpg', icon: 'fab', class: 'fa-amazon', color: '#FF9900', bg: '#fff5e6' },
  'TSLA': { img: '/assets/images/TSLA.jpg', icon: 'fas', class: 'fa-car', color: '#E31937', bg: '#fde8e8' },
  'META': { img: '/assets/images/META.jpg', icon: 'fab', class: 'fa-facebook', color: '#0668E1', bg: '#e6f0ff' },
  'NVDA': { img: '/assets/images/NVDA.png', icon: 'fas', class: 'fa-microchip', color: '#76B900', bg: '#eaf5d8' },
  'JPM': { img: '/assets/images/JPM.png', icon: 'fas', class: 'fa-university', color: '#116D6E', bg: '#e0f2f1' },
  'V': { icon: 'fas', class: 'fa-credit-card', color: '#1A1F71', bg: '#e6e6f0' },
  'JNJ': { icon: 'fas', class: 'fa-plus-square', color: '#007N1D', bg: '#e0f2e1' },
  'WMT': { img: '/assets/images/WMT.png', icon: 'fas', class: 'fa-shopping-cart', color: '#0071CE', bg: '#e0f0ff' },
  'PG': { icon: 'fas', class: 'fa-barcode', color: '#002D6D', bg: '#e6efff' },
  'MA': { icon: 'fas', class: 'fa-credit-card', color: '#EB001B', bg: '#fce8e8' },
  'UNH': { icon: 'fas', class: 'fa-hospital', color: '#116D6E', bg: '#e0f2f1' },
  'HD': { icon: 'fas', class: 'fa-home', color: '#F96302', bg: '#fff0e6' },
  'DIS': { img: '/assets/images/DIS.png', icon: 'fas', class: 'fa-film', color: '#113CCF', bg: '#e6eaff' },
  'BAC': { img: '/assets/images/BAC.avif', icon: 'fas', class: 'fa-building', color: '#E31837', bg: '#fde8e8' },
  'ADBE': { img: '/assets/images/ADBE', icon: 'fas', class: 'fa-pen-fancy', color: '#FF0000', bg: '#fde8e8' },
  'CRM': { img: '/assets/images/CRM.png', icon: 'fas', class: 'fa-cloud', color: '#00A1E0', bg: '#e0f2ff' },
  'NFLX': { img: '/assets/images/NFLX.png', icon: 'fas', class: 'fa-tv', color: '#E50914', bg: '#fde8e8' },
  'PYPL': { icon: 'fas', class: 'fa-wallet', color: '#003087', bg: '#e6efff' },
  'INTC': { img: '/assets/images/INTC.png', icon: 'fas', class: 'fa-microchip', color: '#0071C5', bg: '#e0f0ff' },
  'AMD': { img: '/assets/images/AMD.png', icon: 'fas', class: 'fa-microchip', color: '#ED1C24', bg: '#fde8e8' },
  'COIN': { img: '/assets/images/COIN.webp', icon: 'fab', class: 'fa-bitcoin', color: '#0052FF', bg: '#e0f0ff' },
  'BTC': { img: '/assets/images/BTC.png', icon: 'fab', class: 'fa-bitcoin', color: '#F7931A', bg: '#fff5e6' },
  'ETH': { img: '/assets/images/ETH.png', icon: 'fab', class: 'fa-ethereum', color: '#627EEA', bg: '#e8edff' },
  'SPY': { img: '/assets/images/SPY.jpg', icon: 'fas', class: 'fa-chart-line', color: '#3b82f6', bg: '#dbeafe' },
  'QQQ': { icon: 'fas', class: 'fa-chart-line', color: '#8b5cf6', bg: '#ede9fe' },
  'BND': { img: '/assets/images/BND.png', icon: 'fas', class: 'fa-university', color: '#10b981', bg: '#d1fae5' },
  'VTI': { img: '/assets/images/VTI.png', icon: 'fas', class: 'fa-chart-pie', color: '#3b82f6', bg: '#dbeafe' },
  'SMCI': { img: '/assets/images/SMCI.png', icon: 'fas', class: 'fa-server', color: '#40BE46', bg: '#e0f5e0' },
  'PLTR': { img: '/assets/images/PLTR.png', icon: 'fas', class: 'fa-chart-line', color: '#00A9CE', bg: '#e0f5ff' },
  'SOFI': { img: '/assets/images/SOFI.png', icon: 'fas', class: 'fa-university', color: '#00D2BE', bg: '#e0faf8' },
  'HOOD': { img: '/assets/images/HOOD.svg', icon: 'fas', class: 'fa-chart-line', color: '#00C805', bg: '#e0f5e0' },
  'DEFAULT': { icon: 'fas', class: 'fa-building', color: '#64748b', bg: '#f1f5f9' }
};

// Chart instances
let allocationChart = null;
let performanceChart = null;

// Demo market data
const demoMarketData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 2.35, changePercent: 1.33, volume: '52.3M' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 175.45, change: -0.87, changePercent: -0.49, volume: '28.1M' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 420.10, change: 5.23, changePercent: 1.26, volume: '31.5M' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.92, change: 1.45, changePercent: 0.79, volume: '45.2M' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -3.21, changePercent: -1.28, volume: '89.7M' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, change: 15.67, changePercent: 1.82, volume: '67.8M' },
  { symbol: 'META', name: 'Meta Platforms', price: 485.23, change: 8.92, changePercent: 1.87, volume: '22.4M' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 195.45, change: 1.23, changePercent: 0.63, volume: '15.2M' }
];

// Demo portfolio data
const demoPortfolioData = [
  { id: 1, tickerSymbol: 'AAPL', assetName: 'Apple Inc.', assetType: 'STOCK', quantity: 50, purchasePrice: 150.00, currentPrice: 178.72 },
  { id: 2, tickerSymbol: 'GOOGL', assetName: 'Alphabet Inc.', assetType: 'STOCK', quantity: 25, purchasePrice: 140.00, currentPrice: 175.45 },
  { id: 3, tickerSymbol: 'MSFT', assetName: 'Microsoft Corp.', assetType: 'STOCK', quantity: 30, purchasePrice: 380.00, currentPrice: 420.10 },
  { id: 4, tickerSymbol: 'SPY', assetName: 'SPDR S&P 500 ETF', assetType: 'ETF', quantity: 40, purchasePrice: 475.00, currentPrice: 520.00 },
  { id: 5, tickerSymbol: 'NVDA', assetName: 'NVIDIA Corp.', assetType: 'STOCK', quantity: 10, purchasePrice: 450.00, currentPrice: 875.30 }
];

// Top Gainers Data
const topGainersData = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, changePercent: 5.67, volume: '67.8M' },
  { symbol: 'SMCI', name: 'Super Micro', price: 980.50, changePercent: 4.89, volume: '45.2M' },
  { symbol: 'META', name: 'Meta Platforms', price: 485.23, changePercent: 4.23, volume: '22.4M' },
  { symbol: 'AMD', name: 'AMD Inc.', price: 180.25, changePercent: 3.89, volume: '52.1M' },
  { symbol: 'PLTR', name: 'Palantir', price: 75.80, changePercent: 3.56, volume: '89.3M' },
  { symbol: 'SOFI', name: 'SoFi Tech', price: 12.45, changePercent: 3.21, volume: '34.5M' }
];

// Top Losers Data
const topLosersData = [
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, changePercent: -3.45, volume: '89.7M' },
  { symbol: 'INTC', name: 'Intel Corp.', price: 45.30, changePercent: -2.89, volume: '38.2M' },
  { symbol: 'BAC', name: 'Bank of America', price: 33.25, changePercent: -2.34, volume: '42.1M' },
  { symbol: 'DIS', name: 'Walt Disney', price: 95.80, changePercent: -2.12, volume: '18.5M' },
  { symbol: 'PYPL', name: 'PayPal', price: 62.45, changePercent: -1.89, volume: '21.3M' },
  { symbol: 'HOOD', name: 'Robinhood', price: 22.30, changePercent: -1.67, volume: '15.8M' }
];

// Sectors Trending Data
const sectorsTrendingData = [
  { name: 'Technology', change: 2.34, icon: 'fa-microchip', color: '#3b82f6' },
  { name: 'Healthcare', change: 1.56, icon: 'fa-heartbeat', color: '#10b981' },
  { name: 'Financial', change: 1.23, icon: 'fa-university', color: '#f59e0b' },
  { name: 'Consumer', change: 0.89, icon: 'fa-shopping-cart', color: '#8b5cf6' },
  { name: 'Energy', change: -0.45, icon: 'fa-bolt', color: '#ef4444' },
  { name: 'Industrial', change: 0.34, icon: 'fa-industry', color: '#06b6d4' },
  { name: 'Materials', change: -0.67, icon: 'fa-cubes', color: '#64748b' },
  { name: 'Real Estate', change: 0.12, icon: 'fa-building', color: '#ec4899' }
];

// Stocks in News Data
const stocksInNewsData = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    title: 'NVIDIA shares surge as AI demand continues to exceed expectations',
    source: 'Bloomberg',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop',
    sentiment: 'positive'
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    title: 'Apple announces new AI features coming to iPhone next month',
    source: 'Reuters',
    time: '3 hours ago',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=200&fit=crop',
    sentiment: 'positive'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    title: 'Tesla faces increased competition in EV market, shares dip',
    source: 'CNBC',
    time: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=200&fit=crop',
    sentiment: 'negative'
  },
  {
    symbol: 'META',
    name: 'Meta Platforms',
    title: 'Meta reports record quarterly revenue, beats estimates',
    source: 'Wall Street Journal',
    time: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1633675254053-d96c7668c3b8?w=400&h=200&fit=crop',
    sentiment: 'positive'
  }
];

// Demo Orders Data
const demoOrdersData = [
  { id: 1, symbol: 'AAPL', type: 'BUY', quantity: 10, price: 175.50, date: '2026-01-28', status: 'Completed' },
  { id: 2, symbol: 'MSFT', type: 'BUY', quantity: 5, price: 415.00, date: '2026-01-27', status: 'Completed' },
  { id: 3, symbol: 'NVDA', type: 'SELL', quantity: 2, price: 850.00, date: '2026-01-26', status: 'Completed' },
  { id: 4, symbol: 'GOOGL', type: 'BUY', quantity: 10, price: 172.30, date: '2026-01-25', status: 'Pending' },
  { id: 5, symbol: 'SPY', type: 'BUY', quantity: 20, price: 518.00, date: '2026-01-24', status: 'Completed' }
];

// Demo Watchlist Data
const demoWatchlistData = [
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.92, changePercent: 0.79 },
  { symbol: 'SMCI', name: 'Super Micro Computer', price: 980.50, changePercent: 4.89 },
  { symbol: 'PLTR', name: 'Palantir Technologies', price: 75.80, changePercent: 3.56 },
  { symbol: 'SOFI', name: 'SoFi Technologies', price: 12.45, changePercent: 3.21 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 180.25, changePercent: 3.89 }
];

// Yahoo Finance API configuration
const YAHOO_API_CONFIG = {
  baseUrl: 'https://query1.finance.yahoo.com/v8/finance',
};

// Fetch live quotes from backend (Yahoo proxy) and update datasets
async function fetchAndApplyLiveData() {
  try {
    const symbolSet = new Set([
      ...demoMarketData.map(s => s.symbol),
      ...demoPortfolioData.map(p => p.tickerSymbol),
      ...demoWatchlistData.map(w => w.symbol),
      ...topGainersData.map(g => g.symbol),
      ...topLosersData.map(l => l.symbol),
    ]);
    const symbols = Array.from(symbolSet).join(',');
    if (!symbols) return;

    const res = await fetch(`/api/market/quotes?symbols=${encodeURIComponent(symbols)}`);
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || data.fallbackUsed || !Array.isArray(data.items) || data.items.length === 0) {
      console.warn('Live data unavailable, using demo datasets');
      return; // fallback to demo datasets
    }

    const bySym = Object.fromEntries(data.items.map(i => [i.symbol, i]));

    // Update demoMarketData
    demoMarketData.forEach(s => {
      const q = bySym[s.symbol];
      if (q) {
        s.name = q.name || s.name;
        s.price = q.price ?? s.price;
        s.change = q.change ?? s.change;
        s.changePercent = q.changePercent ?? s.changePercent;
        s.volume = q.volume || s.volume;
      }
    });

    // Update watchlist
    demoWatchlistData.forEach(w => {
      const q = bySym[w.symbol];
      if (q) {
        w.price = q.price ?? w.price;
        w.changePercent = q.changePercent ?? w.changePercent;
      }
    });

    // Update gainers/losers cards
    topGainersData.forEach(g => {
      const q = bySym[g.symbol];
      if (q) {
        g.price = q.price ?? g.price;
        g.changePercent = q.changePercent ?? g.changePercent;
      }
    });
    topLosersData.forEach(l => {
      const q = bySym[l.symbol];
      if (q) {
        l.price = q.price ?? l.price;
        l.changePercent = q.changePercent ?? l.changePercent;
      }
    });

    // Update portfolio current prices
    demoPortfolioData.forEach(p => {
      const q = bySym[p.tickerSymbol];
      if (q && typeof q.price === 'number') {
        p.currentPrice = q.price;
      }
    });

    // Re-render affected UI
    renderMarketData(demoMarketData);
    loadTopMarketMovers();
    loadTopGainersSuggestions();
    renderPortfolioTable(demoPortfolioData);
    updateYourInvestmentSummary();
    updateSummaryCards(calculatePortfolioSummary(demoPortfolioData));
    renderPerformanceChart(demoPortfolioData);
  } catch (err) {
    console.warn('fetchAndApplyLiveData failed, using demo datasets', err);
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

async function initializeApp() {
  try {
    // Load demo data
    loadDemoData();

    // Load all new features
    loadTopGainersSuggestions();
    loadTopMarketMovers();
    loadSectorsTrending();
    loadStocksInNews();
    loadOrders();
    loadWatchlist();
    updateYourInvestmentSummary();

    // Set up event listeners
    setupEventListeners();

    // Initialize charts
    initializeCharts();

    // Inject Language/Currency controls and apply
    setupI18nCurrencyUI();
    applyTranslations();
    updateAllCurrencyDisplays();

    // Try to fetch live market data; fallback to demo if unavailable
    fetchAndApplyLiveData();

    console.log('✅ Portfolio loaded successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    alert('Failed to load portfolio data. Please refresh the page.');
  }
}

function loadDemoData() {
  const summary = calculatePortfolioSummary(demoPortfolioData);
  updateSummaryCards(summary);
  renderPortfolioTable(demoPortfolioData);
  renderMarketData(demoMarketData);
  renderAllocationChart(demoPortfolioData);
}

function calculatePortfolioSummary(items) {
  let totalPurchaseValue = 0;
  let totalCurrentValue = 0;

  items.forEach(item => {
    totalPurchaseValue += item.quantity * item.purchasePrice;
    totalCurrentValue += item.quantity * item.currentPrice;
  });

  const totalGainLoss = totalCurrentValue - totalPurchaseValue;
  const gainLossPercent = totalPurchaseValue > 0 ? (totalGainLoss / totalPurchaseValue) * 100 : 0;

  return {
    totalValue: totalCurrentValue,
    totalInvestment: totalPurchaseValue,
    totalGainLoss: totalGainLoss,
    gainLossPercent: gainLossPercent,
    itemCount: items.length
  };
}

// Your Investment Summary
function updateYourInvestmentSummary() {
  const summary = calculatePortfolioSummary(demoPortfolioData);
  const investmentValue = document.getElementById('yourInvestmentValue');
  const investmentChangeIndicator = document.getElementById('investmentChangeIndicator');
  const investmentChangePercent = document.getElementById('investmentChangePercent');
  const investmentContainer = document.getElementById('yourInvestment');

  if (!investmentValue || !investmentChangeIndicator || !investmentChangePercent) return;

  // Store old value for comparison
  const oldValue = investmentValue.textContent;
  const newValue = formatCurrency(summary.totalValue);

  // Update the value
  investmentValue.textContent = newValue;

  const isPositive = summary.totalGainLoss >= 0;
  investmentChangeIndicator.className = `gain-indicator ${isPositive ? 'up' : 'down'}`;
  investmentChangePercent.textContent = `${isPositive ? '+' : ''}${summary.gainLossPercent.toFixed(2)}%`;

  // Add visual feedback if value changed
  if (oldValue !== newValue && investmentContainer) {
    // Add glowing animation
    investmentContainer.style.transition = 'all 0.3s ease-out';
    investmentContainer.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';
    investmentContainer.style.transform = 'scale(1.05)';

    // Pulse the value
    investmentValue.style.animation = 'valueChange 0.5s ease-out';

    // Reset after animation
    setTimeout(() => {
      investmentContainer.style.boxShadow = '';
      investmentContainer.style.transform = '';
      investmentValue.style.animation = '';
    }, 2000);
  }

  console.log('📊 Navbar Investment Updated:', {
    value: summary.totalValue,
    gainLoss: summary.totalGainLoss,
    percentage: summary.gainLossPercent
  });
}

// Top Gainers Suggestions (below nav bar)
function loadTopGainersSuggestions() {
  const container = document.getElementById('topGainersSuggestions');
  if (!container) return;

  container.innerHTML = topGainersData.map(stock => {
    const iconInfo = getStockIcon(stock.symbol);
    const inWatchlist = isInWatchlist(stock.symbol);
    const watchlistIcon = inWatchlist ? 'fas fa-star' : 'far fa-star';
    const watchlistColor = inWatchlist ? '#f59e0b' : '#94a3b8';

    return `
      <div class="suggestion-card" style="position: relative; padding: 12px; display: flex; flex-direction: column;">
        <div onclick="quickTrade('${stock.symbol}', 'BUY')" style="cursor: pointer; flex: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              ${renderStockIconHtml(stock.symbol, iconInfo, 40)}
              <div>
                <div style="font-weight: 600; color: #1e293b;">${stock.symbol}</div>
                <div style="font-size: 11px; color: #64748b; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${stock.name}</div>
              </div>
            </div>
            <div class="gain-indicator up" style="font-size: 12px;">
              <i class="fas fa-arrow-up"></i>
              +${stock.changePercent.toFixed(2)}%
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 14px; font-weight: 600; color: #1e293b;">${formatCurrency(stock.price)}</span>
            <span style="font-size: 11px; color: #64748b;">Vol: ${stock.volume}</span>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; padding-top: 8px; border-top: 1px solid #f1f5f9;">
          <button onclick="event.stopPropagation(); toggleWatchlist('${stock.symbol}', '${stock.name}', ${stock.price})"
                  style="background: ${inWatchlist ? 'rgba(245,158,11,0.1)' : 'rgba(148,163,184,0.1)'}; border: 1px solid ${inWatchlist ? '#f59e0b' : '#e2e8f0'}; border-radius: 6px; cursor: pointer; padding: 6px 12px; display: flex; align-items: center; gap: 6px; transition: all 0.2s; font-size: 12px; font-weight: 600; color: ${inWatchlist ? '#f59e0b' : '#64748b'};"
                  onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.1)';"
                  onmouseout="this.style.transform=''; this.style.boxShadow='none';"
                  title="${inWatchlist ? 'Remove from' : 'Add to'} watchlist">
            <i class="${watchlistIcon}" style="color: ${watchlistColor}; font-size: 13px;"></i>
            <span>${inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function refreshSuggestions() {
  topGainersData.forEach(stock => {
    const change = (Math.random() - 0.3) * 2;
    stock.changePercent = Math.max(-5, Math.min(10, stock.changePercent + change));
    stock.price = Math.max(0.01, stock.price * (1 + change / 100));
  });
  loadTopGainersSuggestions();
  console.log('✅ Stock suggestions refreshed');
}

// Top Market Movers (Gainers & Losers)
function loadTopMarketMovers() {
  const gainersContainer = document.getElementById('topGainers');
  const losersContainer = document.getElementById('topLosers');
  if (!gainersContainer || !losersContainer) return;

  // Gainers
  gainersContainer.innerHTML = topGainersData.slice(0, 5).map(stock => {
    const iconInfo = getStockIcon(stock.symbol);
    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(16,185,129,0.2);">
        <div style="display: flex; align-items: center; gap: 8px;">
          ${renderStockIconHtml(stock.symbol, iconInfo, 32)}
          <div>
            <div style="font-weight: 600; font-size: 13px; color: #1e293b;">${stock.symbol}</div>
            <div style="font-size: 10px; color: #64748b;">${stock.volume}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 600; font-size: 13px; color: #1e293b;">${formatCurrency(stock.price)}</div>
          <div style="color: #10b981; font-size: 11px; font-weight: 600;">+${stock.changePercent.toFixed(2)}%</div>
        </div>
      </div>
    `;
  }).join('');

  // Losers
  losersContainer.innerHTML = topLosersData.slice(0, 5).map(stock => {
    const iconInfo = getStockIcon(stock.symbol);
    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(239,68,68,0.2);">
        <div style="display: flex; align-items: center; gap: 8px;">
          ${renderStockIconHtml(stock.symbol, iconInfo, 32)}
          <div>
            <div style="font-weight: 600; font-size: 13px; color: #1e293b;">${stock.symbol}</div>
            <div style="font-size: 10px; color: #64748b;">${stock.volume}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 600; font-size: 13px; color: #1e293b;">${formatCurrency(stock.price)}</div>
          <div style="color: #ef4444; font-size: 11px; font-weight: 600;">${stock.changePercent.toFixed(2)}%</div>
        </div>
      </div>
    `;
  }).join('');
}

// Sectors Trending Today
function loadSectorsTrending() {
  const container = document.getElementById('sectorsTrending');
  if (!container) return;
  container.innerHTML = sectorsTrendingData.map(sector => {
    const isPositive = sector.change >= 0;
    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; border-radius: 10px; background: ${isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; display: flex; align-items: center; justify-content: center;">
            <i class="fas ${sector.icon}" style="color: ${sector.color}; font-size: 18px;"></i>
          </div>
          <div>
            <div style="font-weight: 600; color: #1e293b;">${sector.name}</div>
            <div style="font-size: 11px; color: #64748b;">Market sector performance</div>
          </div>
        </div>
        <div class="sector-badge ${isPositive ? 'up' : 'down'}">
          <i class="fas fa-caret-${isPositive ? 'up' : 'down'}"></i>
          <span>${isPositive ? '+' : ''}${sector.change.toFixed(2)}%</span>
        </div>
      </div>
    `;
  }).join('');
}

// Stocks in News Today
function loadStocksInNews() {
  const container = document.getElementById('stocksInNews');
  if (!container) return;
  container.innerHTML = stocksInNewsData.map((news, idx) => {
    const iconInfo = getStockIcon(news.symbol);
    const sentimentIcon = news.sentiment === 'positive' ? 'fa-thumbs-up' : 'fa-thumbs-down';
    const sentimentColor = news.sentiment === 'positive' ? '#10b981' : '#ef4444';
    const detailId = `news-detail-${idx}`;
    const summary = news.summary || 'This is a brief summary of the news article. In a real integration, this would be replaced by content from your news API or a longer excerpt.';
    const link = news.url || '#';

    return `
      <div class="news-card">
        <div style="background: linear-gradient(135deg, ${iconInfo.bg}, ${iconInfo.color}22); padding: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              ${renderStockIconHtml(news.symbol, iconInfo, 36)}
              <div>
                <div style="font-weight: 600; color: #1e293b;">${news.symbol}</div>
                <div style="font-size: 11px; color: #64748b;">${news.name}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <i class="fas ${sentimentIcon}" style="color: ${sentimentColor}; font-size: 14px;"></i>
              <span style="font-size: 11px; color: #64748b;">${news.time}</span>
            </div>
          </div>
          <h4 style="font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 8px; line-height: 1.4;">${news.title}</h4>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 11px; color: #64748b;"><i class="fas fa-newspaper mr-1"></i>${news.source}</span>
            <button onclick="toggleNews(${idx})" style="background: #3b82f6; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">
              Read More
            </button>
          </div>
          <div id="${detailId}" style="display:none; margin-top:10px; background:#fff; padding:12px; border-radius:8px;">
            <p style="color:#374151; font-size:13px; line-height:1.5;">${summary}</p>
            ${link !== '#' ? `<a href="${link}" target="_blank" style="color:#2563eb; font-size:12px;">Open full article</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleNews(idx) {
  const el = document.getElementById(`news-detail-${idx}`);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function refreshNews() {
  stocksInNewsData.forEach(news => {
    const sentimentChange = Math.random() > 0.5 ? 'positive' : 'negative';
    news.sentiment = sentimentChange;
    const randomHours = Math.floor(Math.random() * 6) + 1;
    news.time = `${randomHours} hour${randomHours > 1 ? 's' : ''} ago`;
  });
  loadStocksInNews();
  console.log('✅ News refreshed');
}

// Load Orders
function loadOrders() {
  const container = document.getElementById('ordersList');
  if (!container) return;
  container.innerHTML = demoOrdersData.slice(0, 5).map(order => {
    const isBuy = order.type === 'BUY';
    const iconInfo = getStockIcon(order.symbol);

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${renderStockIconHtml(order.symbol, iconInfo, 40)}
          <div>
            <div style="font-weight: 600; color: #1e293b;">
              ${order.type} ${order.symbol}
            </div>
            <div style="font-size: 11px; color: #64748b;">
              ${order.quantity} shares @ ${formatCurrency(order.price)}
            </div>
          </div>
        </div>
        <div style="text-align: right;">
          <div class="gain-indicator ${isBuy ? 'up' : 'down'}" style="font-size: 11px;">
            <i class="fas fa-${isBuy ? 'arrow-up' : 'arrow-down'}"></i>
            ${order.type}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${order.date}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Load Watchlist
function loadWatchlist() {
  const container = document.getElementById('watchlistData');
  if (!container) return;
  container.innerHTML = demoWatchlistData.map(stock => {
    const iconInfo = getStockIcon(stock.symbol);
    const isPositive = stock.changePercent >= 0;

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
          ${renderStockIconHtml(stock.symbol, iconInfo, 40)}
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #1e293b;">${stock.symbol}</div>
            <div style="font-size: 11px; color: #64748b;">${stock.name}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="text-align: right;">
            <div style="font-weight: 600; color: #1e293b;">${formatCurrency(stock.price)}</div>
            <div class="gain-indicator ${isPositive ? 'up' : 'down'}" style="font-size: 11px;">
              <i class="fas fa-caret-${isPositive ? 'up' : 'down'}"></i>
              ${isPositive ? '+' : ''}${stock.changePercent.toFixed(2)}%
            </div>
          </div>
          <button onclick="removeFromWatchlist('${stock.symbol}')"
                  style="background: rgba(239,68,68,0.1); border: none; color: #ef4444; cursor: pointer; padding: 8px 10px; border-radius: 6px; display: flex; align-items: center; gap: 4px;"
                  title="Remove from watchlist">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Watchlist management functions
function addToWatchlist(symbol, name, price) {
  // Check if already in watchlist
  const exists = demoWatchlistData.find(s => s.symbol === symbol);
  if (exists) {
    return; // Already in watchlist, no action needed
  }

  // Add to watchlist
  demoWatchlistData.push({
    symbol: symbol,
    name: name || symbol,
    price: price || 0,
    changePercent: 0
  });

  // Visual feedback
  showWatchlistFeedback('ADDED', symbol, name);

  loadWatchlist();
  loadTopGainersSuggestions(); // Refresh to update star icons
  renderMarketData(demoMarketData); // Refresh to update star icons

  // Highlight watchlist panel
  highlightWatchlistPanel();
}

function removeFromWatchlist(symbol) {
  const index = demoWatchlistData.findIndex(s => s.symbol === symbol);
  if (index !== -1) {
    const removed = demoWatchlistData[index];
    demoWatchlistData.splice(index, 1);

    // Visual feedback
    showWatchlistFeedback('REMOVED', symbol, removed.name);

    loadWatchlist();
    loadTopGainersSuggestions(); // Refresh to update star icons
    renderMarketData(demoMarketData); // Refresh to update star icons
  }
}

function toggleWatchlist(symbol, name, price) {
  const exists = demoWatchlistData.find(s => s.symbol === symbol);
  if (exists) {
    removeFromWatchlist(symbol);
  } else {
    addToWatchlist(symbol, name, price);
  }
}

function isInWatchlist(symbol) {
  return demoWatchlistData.some(s => s.symbol === symbol);
}

// Show watchlist action feedback
function showWatchlistFeedback(action, symbol, name) {
  const color = action === 'ADDED' ? '#f59e0b' : '#64748b';
  const bgColor = action === 'ADDED' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(100, 116, 123, 0.1)';
  const icon = action === 'ADDED' ? 'fa-star' : 'fa-star';
  const iconStyle = action === 'ADDED' ? 'fas' : 'far';

  // Create feedback element
  let feedback = document.getElementById('watchlistFeedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.id = 'watchlistFeedback';
    feedback.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: white;
      border: 2px solid ${color};
      border-radius: 10px;
      padding: 12px 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      min-width: 280px;
      animation: slideInRight 0.3s ease-out;
    `;
    document.body.appendChild(feedback);
  }

  feedback.style.borderColor = color;
  feedback.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 40px; height: 40px; background: ${bgColor}; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        <i class="${iconStyle} ${icon}" style="color: ${color}; font-size: 20px;"></i>
      </div>
      <div style="flex: 1;">
        <div style="font-size: 14px; font-weight: 600; color: #1e293b;">
          ${action === 'ADDED' ? '⭐ Added to Watchlist' : '❌ Removed from Watchlist'}
        </div>
        <div style="font-size: 12px; color: #64748b;">
          ${symbol} ${name ? '· ' + name : ''}
        </div>
      </div>
    </div>
  `;

  // Add slide animation
  if (!document.getElementById('watchlistAnimationStyles')) {
    const style = document.createElement('style');
    style.id = 'watchlistAnimationStyles';
    style.textContent = `
      @keyframes slideInRight {
        from { right: -300px; opacity: 0; }
        to { right: 20px; opacity: 1; }
      }
      @keyframes highlightPanel {
        0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
        50% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
        100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
      }
    `;
    document.head.appendChild(style);
  }

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (feedback && feedback.parentElement) {
      feedback.style.transition = 'opacity 0.3s, right 0.3s';
      feedback.style.opacity = '0';
      feedback.style.right = '-300px';
      setTimeout(() => feedback.remove(), 300);
    }
  }, 3000);
}

// Highlight watchlist panel
function highlightWatchlistPanel() {
  const watchlistCard = document.querySelector('#watchlistData')?.closest('.card');
  if (watchlistCard) {
    watchlistCard.style.animation = 'highlightPanel 1.5s ease-out';
    setTimeout(() => watchlistCard.style.animation = '', 1500);

    // Scroll to watchlist
    watchlistCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Setup Event Listeners
function setupEventListeners() {
  const search = document.getElementById('globalSearch');
  if (search) search.addEventListener('input', debounce(handleGlobalSearch, 300));

  const form = document.getElementById('positionForm');
  if (form) form.addEventListener('submit', handleFormSubmit);

  const modal = document.getElementById('positionModal');
  if (modal) modal.addEventListener('click', function(e) { if (e.target === this) closeModal(); });

  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function initializeCharts() {
  renderPerformanceChart(demoPortfolioData);
}

// Market Data Functions
function renderMarketData(data) {
  const container = document.getElementById('marketDataList');
  if (!container) return;

  container.innerHTML = data.map(stock => {
    const isPositive = stock.change >= 0;
    const iconInfo = getStockIcon(stock.symbol);
    const inWatchlist = isInWatchlist(stock.symbol);
    const watchlistIcon = inWatchlist ? 'fas fa-star' : 'far fa-star';
    const watchlistColor = inWatchlist ? '#f59e0b' : '#94a3b8';

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
          ${renderStockIconHtml(stock.symbol, iconInfo, 44)}
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #1e293b;">${stock.symbol}</div>
            <div style="font-size: 12px; color: #64748b;">${stock.name}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="text-align: right; min-width: 120px;">
            <div style="font-weight: 600; color: #1e293b;">${formatCurrency(stock.price)}</div>
            <div class="price-change ${isPositive ? 'stock-up' : 'stock-down'}" style="font-size: 13px;">
              <i class="fas fa-caret-${isPositive ? 'up' : 'down'}"></i>
              <span>${isPositive ? '+' : ''}${stock.change.toFixed(2)} (${isPositive ? '+' : ''}${stock.changePercent.toFixed(2)}%)</span>
            </div>
          </div>
          <button onclick="toggleWatchlist('${stock.symbol}', '${stock.name}', ${stock.price})"
                  style="background: rgba(148,163,184,0.1); border: 1px solid #e2e8f0; cursor: pointer; padding: 8px 10px; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; justify-content: center;"
                  onmouseover="this.style.background='rgba(245,158,11,0.1)'; this.style.borderColor='${inWatchlist ? '#f59e0b' : '#cbd5e1'}';"
                  onmouseout="this.style.background='rgba(148,163,184,0.1)'; this.style.borderColor='#e2e8f0';"
                  title="${inWatchlist ? 'Remove from' : 'Add to'} watchlist">
            <i class="${watchlistIcon}" style="color: ${watchlistColor}; font-size: 16px;"></i>
          </button>
          <button onclick="quickTrade('${stock.symbol}', 'BUY')"
                  style="background: rgba(16,185,129,0.1); border: none; color: #10b981; cursor: pointer; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;"
                  title="Quick Buy">
            <i class="fas fa-cart-plus"></i> Buy
          </button>
        </div>
      </div>
    `;
  }).join('');
}

async function refreshMarketData() {
  demoMarketData.forEach(stock => {
    const change = (Math.random() - 0.5) * 2;
    stock.price = Math.max(0, stock.price + change);
    stock.change = change;
    stock.changePercent = (change / stock.price) * 100;
  });
  renderMarketData(demoMarketData);
  console.log('✅ Market data refreshed');
}

// Portfolio Table Functions
function renderPortfolioTable(items) {
  const tbody = document.getElementById('portfolioTableBody');
  if (!tbody) return;

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="padding: 40px; text-align: center; color: #64748b;">
          <i class="fas fa-briefcase" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i>
          <p>No portfolio items. Add your first position!</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const purchaseValue = item.quantity * item.purchasePrice;
    const currentValue = item.quantity * item.currentPrice;
    const gainLoss = currentValue - purchaseValue;
    const gainLossPercent = item.purchasePrice > 0 ? ((item.currentPrice - item.purchasePrice) / item.purchasePrice) * 100 : 0;
    const isPositive = gainLoss >= 0;
    const iconInfo = getStockIcon(item.tickerSymbol);

    return `
      <tr class="stock-table-row" style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 16px 8px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${renderStockIconHtml(item.tickerSymbol, iconInfo, 40)}
            <div>
              <div style="font-weight: 600; color: #1e293b;">${item.tickerSymbol}</div>
              <div style="font-size: 12px; color: #64748b;">${item.assetName}</div>
            </div>
          </div>
        </td>
        <td style="padding: 16px 8px; text-align: right;">
          <div style="font-weight: 600; color: #1e293b;">${formatCurrency(item.currentPrice)}</div>
          <div style="font-size: 12px; color: #64748b;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding: 16px 8px; text-align: right;">
          <div class="${isPositive ? 'stock-up' : 'stock-down'}" style="font-weight: 600;">
            <i class="fas fa-caret-${isPositive ? 'up' : 'down'}"></i>
            ${formatCurrency(Math.abs(gainLoss))}
          </div>
          <div class="gain-indicator ${isPositive ? 'up' : 'down'}" style="font-size: 11px;">
            <i class="fas fa-caret-${isPositive ? 'up' : 'down'}"></i>
            ${isPositive ? '+' : ''}${gainLossPercent.toFixed(2)}%
          </div>
        </td>
        <td style="padding: 16px 8px; text-align: right;">
          <div style="font-weight: 600; color: #1e293b;">${formatCurrency(currentValue)}</div>
          <div style="font-size: 12px; color: #64748b;">Purchase: ${formatCurrency(purchaseValue)}</div>
        </td>
        <td style="padding: 16px 8px; text-align: center;">
          <div style="display: flex; justify-content: center; gap: 8px;">
            <button onclick="editPosition(${item.id})" style="background: none; border: none; color: #3b82f6; cursor: pointer; padding: 6px;" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="quickTrade('${item.tickerSymbol}', 'BUY')" style="background: rgba(16,185,129,0.1); border: none; color: #10b981; cursor: pointer; padding: 6px 10px; border-radius: 6px;" title="Buy">
              <i class="fas fa-plus"></i>
            </button>
            <button onclick="quickTrade('${item.tickerSymbol}', 'SELL')" style="background: rgba(239,68,68,0.1); border: none; color: #ef4444; cursor: pointer; padding: 6px 10px; border-radius: 6px;" title="Sell">
              <i class="fas fa-minus"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function getStockIcon(symbol) {
  return stockIcons[symbol] || stockIcons['DEFAULT'];
}

// Helper: render stock icon preferring real logo images with fallback to Font Awesome icons
function renderStockIconHtml(symbol, iconInfo, size = 40) {
  const s = Number(size) || 40;
  const img = iconInfo && iconInfo.img ? iconInfo.img : null;

  if (img) {
    // Try to use real logo image with error fallback to icon/initials
    const bg = iconInfo.bg || '#f5f5f9';
    const color = iconInfo.color || '#64748b';
    const fallbackClass = iconInfo.class ? `${iconInfo.icon} ${iconInfo.class}` : '';
    const fallbackContent = fallbackClass
      ? `<i class="${fallbackClass}" style="font-size:${Math.floor(s/2)}px;"></i>`
      : `<span style="font-size:${Math.floor(s/2.5)}px;font-weight:600;">${(symbol || '').slice(0, 3).toUpperCase()}</span>`;

    return `<div style="width:${s}px;height:${s}px;border-radius:10px;background:${bg};display:flex;align-items:center;justify-content:center;color:${color};overflow:hidden;position:relative;">
      <img src="${img}" alt="${symbol}"
           style="width:85%;height:85%;object-fit:contain;display:block;"
           onerror="this.style.display='none';this.parentElement.querySelector('.fallback-icon').style.display='flex';" />
      <div class="fallback-icon" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;position:absolute;top:0;left:0;">
        ${fallbackContent}
      </div>
    </div>`;
  }

  // No image available - use Font Awesome icon or initials
  const bg = (iconInfo && iconInfo.bg) ? iconInfo.bg : '#f1f5f9';
  const color = (iconInfo && iconInfo.color) ? iconInfo.color : '#64748b';

  if (iconInfo && iconInfo.class) {
    return `<div style="width:${s}px;height:${s}px;border-radius:10px;background:${bg};display:flex;align-items:center;justify-content:center;color:${color};"><i class="${iconInfo.icon} ${iconInfo.class}" style="font-size:${Math.floor(s/2)}px;"></i></div>`;
  }

  const initials = (symbol || '').slice(0, 3).toUpperCase();
  return `<div style="width:${s}px;height:${s}px;border-radius:10px;background:${bg};display:flex;align-items:center;justify-content:center;color:${color};font-weight:600;font-size:${Math.floor(s/2.5)}px;">${initials}</div>`;
}

// Summary Cards Functions
function updateSummaryCards(summary) {
  const totalValueEl = document.getElementById('totalValue');
  const totalInvestmentEl = document.getElementById('totalInvestment');
  const gainLossElement = document.getElementById('totalGainLoss');
  const indicator = document.getElementById('totalGainIndicator');
  const totalItemsEl = document.getElementById('totalItems');

  if (totalValueEl) totalValueEl.textContent = formatCurrency(summary.totalValue);
  if (totalInvestmentEl) totalInvestmentEl.textContent = formatCurrency(summary.totalInvestment);

  if (gainLossElement) {
    const isPositive = summary.totalGainLoss >= 0;
    gainLossElement.textContent = (isPositive ? '+' : '') + formatCurrency(summary.totalGainLoss);
    gainLossElement.style.color = isPositive ? '#10b981' : '#ef4444';
  }

  if (indicator) {
    const isPositive = summary.totalGainLoss >= 0;
    indicator.className = `gain-indicator ${isPositive ? 'up' : 'down'}`;
    const indicatorIcon = indicator.querySelector('i');
    const indicatorText = indicator.querySelector('span');
    if (indicatorIcon) indicatorIcon.className = `fas fa-arrow-${isPositive ? 'up' : 'down'}`;
    if (indicatorText) indicatorText.textContent = `${isPositive ? '+' : ''}${summary.gainLossPercent.toFixed(2)}%`;
  }

  if (totalItemsEl) totalItemsEl.textContent = summary.itemCount;
}

// Chart Functions
function renderAllocationChart(items) {
  const ctx = document.getElementById('allocationChart').getContext('2d');
  if (allocationChart) allocationChart.destroy();

  const allocation = {};
  let totalValue = 0;

  items.forEach(item => {
    const value = item.quantity * item.currentPrice;
    allocation[item.assetType] = (allocation[item.assetType] || 0) + value;
    totalValue += value;
  });

  const labels = Object.keys(allocation).map(type => {
    const icons = { 'STOCK': '📈', 'ETF': '📊', 'BOND': '🏦', 'MUTUAL_FUND': '💼', 'CRYPTO': '₿' };
    return `${icons[type] || '📦'} ${type.replace('_', ' ')}`;
  });
  const data = Object.values(allocation).map(v => (v / totalValue * 100).toFixed(1));
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  allocationChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true, font: { size: 11 } } }
      },
      cutout: '65%'
    }
  });
}

function renderPerformanceChart(items) {
  const ctx = document.getElementById('performanceChart').getContext('2d');
  if (performanceChart) performanceChart.destroy();

  const labels = items.map(item => item.tickerSymbol);
  const purchaseValues = items.map(item => item.quantity * item.purchasePrice);
  const currentValues = items.map(item => item.quantity * item.currentPrice);

  performanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Purchase Value',
          data: purchaseValues,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: '#3b82f6',
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: 'Current Value',
          data: currentValues,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: '#10b981',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true, font: { size: 11 } } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}` } }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (value) => formatCurrency(value) },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

function updateChartPeriod(period) {
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.style.background = btn.textContent === period ? '#3b82f6' : '#e2e8f0';
    btn.style.color = btn.textContent === period ? '#fff' : '#64748b';
  });

  // Adjust current values by a simple factor to simulate time period changes
  const factors = { '1D': 1.00, '1W': 0.98, '1M': 1.05, '1Y': 1.20 };
  const factor = factors[period] || 1.00;

  const adjusted = demoPortfolioData.map(item => ({
    ...item,
    currentPrice: Math.max(0, item.currentPrice * factor)
  }));

  renderPerformanceChart(adjusted);
  console.log(`Showing ${period} performance data`);
}

// Modal Functions
function showAddModal() {
  document.getElementById('modalTitle').textContent = 'Add New Position';
  document.getElementById('positionForm').reset();
  document.getElementById('positionId').value = '';
  document.getElementById('purchaseDate').valueAsDate = new Date();
  document.getElementById('positionModal').style.display = 'flex';
}

function showEditModal(item) {
  document.getElementById('modalTitle').textContent = 'Edit Position';
  document.getElementById('positionId').value = item.id;
  document.getElementById('stockSymbol').value = item.tickerSymbol;
  document.getElementById('companyName').value = item.assetName;
  document.getElementById('assetType').value = item.assetType;
  document.getElementById('quantity').value = item.quantity;
  document.getElementById('purchasePrice').value = item.purchasePrice;
  document.getElementById('currentPrice').value = item.currentPrice;
  document.getElementById('purchaseDate').value = item.purchaseDate || '';
  document.getElementById('positionModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('positionModal').style.display = 'none';
}

// Form Handler
async function handleFormSubmit(event) {
  event.preventDefault();

  const positionId = document.getElementById('positionId').value;
  const positionData = {
    tickerSymbol: document.getElementById('stockSymbol').value.toUpperCase(),
    assetName: document.getElementById('companyName').value,
    assetType: document.getElementById('assetType').value,
    quantity: parseFloat(document.getElementById('quantity').value),
    purchasePrice: parseFloat(document.getElementById('purchasePrice').value),
    currentPrice: document.getElementById('currentPrice').value
      ? parseFloat(document.getElementById('currentPrice').value)
      : parseFloat(document.getElementById('purchasePrice').value),
    purchaseDate: document.getElementById('purchaseDate').value || new Date().toISOString().split('T')[0],
    notes: document.getElementById('notes').value
  };

  try {
    if (positionId) {
      const index = demoPortfolioData.findIndex(p => p.id === parseInt(positionId));
      if (index !== -1) {
        demoPortfolioData[index] = { ...demoPortfolioData[index], ...positionData };
      }
      console.log('✅ Position updated successfully');
    } else {
      const newId = Math.max(...demoPortfolioData.map(p => p.id), 0) + 1;
      demoPortfolioData.push({ id: newId, ...positionData });
      console.log('✅ Position added successfully');
    }

    closeModal();
    refreshAllDisplays();
  } catch (error) {
    console.error('Error saving position:', error);
    alert('Failed to save position. Please try again.');
  }
}

// CRUD Operations
function editPosition(id) {
  const item = demoPortfolioData.find(p => p.id === id);
  if (item) showEditModal(item);
}

// Global variables for quantity modal
let quantityModalCallback = null;
let quantityModalData = null;

function showQuantityModal(symbol, action, stockInfo) {
  console.log('🎯 showQuantityModal called:', symbol, action, stockInfo);

  const modal = document.getElementById('quantityModal');
  const title = document.getElementById('quantityModalTitle');
  const symbolEl = document.getElementById('quantityStockSymbol');
  const nameEl = document.getElementById('quantityStockName');
  const priceEl = document.getElementById('quantityStockPrice');
  const input = document.getElementById('quantityInput');
  const maxInfo = document.getElementById('quantityMaxInfo');
  const btn = document.getElementById('confirmQuantityBtn');

  if (!modal) {
    console.error('❌ Quantity modal not found!');
    alert('Error: Quantity modal not found. Please refresh the page.');
    return;
  }

  quantityModalData = { symbol, action, stockInfo };

  // Set modal content
  symbolEl.textContent = symbol;
  nameEl.textContent = stockInfo.name || symbol;
  priceEl.textContent = formatCurrency(stockInfo.price);

  if (action === 'SELL') {
    const position = demoPortfolioData.find(p => p.tickerSymbol === symbol);
    if (position) {
      title.textContent = `Sell ${symbol}`;
      input.value = position.quantity;
      input.max = position.quantity;
      maxInfo.textContent = `You own ${position.quantity} shares`;
      btn.style.background = '#ef4444';
      btn.innerHTML = '<i class="fas fa-minus"></i> Sell';
    }
  } else {
    title.textContent = `Buy ${symbol}`;
    input.value = 10;
    input.removeAttribute('max');
    maxInfo.textContent = '';
    btn.style.background = '#10b981';
    btn.innerHTML = '<i class="fas fa-plus"></i> Buy';
  }

  updateQuantityTotal();
  modal.style.display = 'flex';
  input.focus();
  input.select();

  console.log('✅ Modal displayed');
}

function updateQuantityTotal() {
  if (!quantityModalData) return;
  const input = document.getElementById('quantityInput');
  const totalEl = document.getElementById('quantityTotalCost');
  const quantity = parseInt(input.value) || 0;
  const total = quantity * quantityModalData.stockInfo.price;
  totalEl.textContent = `Total: ${formatCurrency(total)}`;
}

function closeQuantityModal() {
  document.getElementById('quantityModal').style.display = 'none';
  quantityModalData = null;
  quantityModalCallback = null;
}

function confirmQuantity() {
  console.log('✅ confirmQuantity called', quantityModalData);

  if (!quantityModalData) {
    console.error('❌ quantityModalData is null!');
    alert('Error: No stock data found. Please try again.');
    closeQuantityModal();
    return;
  }

  const input = document.getElementById('quantityInput');
  const quantity = parseInt(input.value);

  if (isNaN(quantity) || quantity <= 0) {
    alert('❌ Please enter a valid quantity');
    return;
  }

  if (quantityModalData.action === 'SELL') {
    const position = demoPortfolioData.find(p => p.tickerSymbol === quantityModalData.symbol);
    if (position && quantity > position.quantity) {
      alert(`❌ You only have ${position.quantity} shares`);
      return;
    }
  }

  // Save data before closing modal (which sets it to null)
  const savedSymbol = quantityModalData.symbol;
  const savedAction = quantityModalData.action;
  const savedStockInfo = quantityModalData.stockInfo;

  closeQuantityModal();

  // Execute trade with saved data
  executeTradeWithQuantity(savedSymbol, savedAction, savedStockInfo, quantity);
}

function quickTrade(symbol, action) {
  console.log('🔔 quickTrade called:', symbol, action);

  // Find stock info
  let stockInfo = demoMarketData.find(s => s.symbol === symbol) ||
                  demoWatchlistData.find(s => s.symbol === symbol) ||
                  topGainersData.find(s => s.symbol === symbol) ||
                  topLosersData.find(s => s.symbol === symbol);

  if (!stockInfo) {
    alert(`❌ Stock ${symbol} not found`);
    return;
  }

  console.log('📊 Stock info found:', stockInfo);

  // Show modal for quantity input
  showQuantityModal(symbol, action, stockInfo);
}

function executeTradeWithQuantity(symbol, action, stockInfo, quantity) {
  const price = stockInfo.price || 100;

  // Calculate BEFORE values
  const summaryBefore = calculatePortfolioSummary(demoPortfolioData);
  const oldTotalValue = summaryBefore.totalValue;
  const oldTotalInvestment = summaryBefore.totalInvestment;
  const oldGainLoss = summaryBefore.totalGainLoss;

  let oldQuantity = 0;
  let newQuantity = 0;
  let actionDetails = '';

  if (action === 'BUY') {
    const existingPosition = demoPortfolioData.find(p => p.tickerSymbol === symbol);

    if (existingPosition) {
      oldQuantity = existingPosition.quantity;
      const totalShares = existingPosition.quantity + quantity;
      const totalCost = (existingPosition.quantity * existingPosition.purchasePrice) + (quantity * price);
      existingPosition.quantity = totalShares;
      existingPosition.purchasePrice = totalCost / totalShares;
      existingPosition.currentPrice = price;
      newQuantity = totalShares;
      actionDetails = `Quantity: ${oldQuantity} → ${newQuantity} shares`;
    } else {
      const newId = Math.max(...demoPortfolioData.map(p => p.id), 0) + 1;
      const newPosition = {
        id: newId,
        tickerSymbol: symbol,
        assetName: stockInfo.name || symbol,
        assetType: 'STOCK',
        quantity: quantity,
        purchasePrice: price,
        currentPrice: price,
        purchaseDate: new Date().toISOString().split('T')[0]
      };
      demoPortfolioData.push(newPosition);
      newQuantity = quantity;
      actionDetails = `New position created · ${newQuantity} shares`;
    }

    demoOrdersData.unshift({
      id: Math.max(...demoOrdersData.map(o => o.id), 0) + 1,
      symbol: symbol,
      type: 'BUY',
      quantity: quantity,
      price: price,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    });

  } else if (action === 'SELL') {
    const position = demoPortfolioData.find(p => p.tickerSymbol === symbol);

    if (!position) {
      alert(`❌ You don't own ${symbol}`);
      return;
    }

    if (position.quantity < quantity) {
      alert(`❌ Insufficient shares. You only have ${position.quantity} shares of ${symbol}`);
      return;
    }

    oldQuantity = position.quantity;
    position.quantity -= quantity;
    position.currentPrice = price;

    if (position.quantity === 0) {
      const index = demoPortfolioData.findIndex(p => p.id === position.id);
      demoPortfolioData.splice(index, 1);
      newQuantity = 0;
      actionDetails = `Position closed · Sold all ${oldQuantity} shares`;
    } else {
      newQuantity = position.quantity;
      actionDetails = `Quantity: ${oldQuantity} → ${newQuantity} shares`;
    }

    demoOrdersData.unshift({
      id: Math.max(...demoOrdersData.map(o => o.id), 0) + 1,
      symbol: symbol,
      type: 'SELL',
      quantity: quantity,
      price: price,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    });
  }

  // Calculate AFTER values
  const summaryAfter = calculatePortfolioSummary(demoPortfolioData);
  const newTotalValue = summaryAfter.totalValue;
  const newTotalInvestment = summaryAfter.totalInvestment;
  const newGainLoss = summaryAfter.totalGainLoss;

  // Calculate changes
  const valueChange = newTotalValue - oldTotalValue;
  const investmentChange = newTotalInvestment - oldTotalInvestment;
  const gainLossChange = newGainLoss - oldGainLoss;

  // Log the changes for debugging
  console.log('💰 Trade Executed:', {
    action,
    symbol,
    quantity,
    price,
    before: {
      value: oldTotalValue,
      investment: oldTotalInvestment,
      gainLoss: oldGainLoss,
      items: summaryBefore.itemCount
    },
    after: {
      value: newTotalValue,
      investment: newTotalInvestment,
      gainLoss: newGainLoss,
      items: summaryAfter.itemCount
    },
    changes: {
      value: valueChange,
      investment: investmentChange,
      gainLoss: gainLossChange
    }
  });

  // Visual feedback with value changes
  showActionFeedback(
    action,
    symbol,
    quantity,
    price,
    actionDetails,
    {
      oldTotalValue,
      newTotalValue,
      valueChange,
      oldTotalInvestment,
      newTotalInvestment,
      investmentChange,
      oldGainLoss,
      newGainLoss,
      gainLossChange,
      oldQuantity,
      newQuantity
    }
  );

  // Comprehensive refresh of ALL displays after trade
  refreshAllDisplays();

  // FORCE navbar update immediately with direct DOM manipulation
  setTimeout(() => {
    const navbarValue = document.getElementById('yourInvestmentValue');
    const navbarContainer = document.getElementById('yourInvestment');
    const navbarIndicator = document.getElementById('investmentChangeIndicator');
    const navbarPercent = document.getElementById('investmentChangePercent');

    if (navbarValue && navbarContainer) {
      const freshSummary = calculatePortfolioSummary(demoPortfolioData);
      navbarValue.textContent = formatCurrency(freshSummary.totalValue);

      const isPositive = freshSummary.totalGainLoss >= 0;
      if (navbarIndicator) {
        navbarIndicator.className = `gain-indicator ${isPositive ? 'up' : 'down'}`;
      }
      if (navbarPercent) {
        navbarPercent.textContent = `${isPositive ? '+' : ''}${freshSummary.gainLossPercent.toFixed(2)}%`;
      }

      // Visual feedback
      navbarContainer.style.transition = 'all 0.5s ease-out';
      navbarContainer.style.boxShadow = '0 0 30px rgba(59, 130, 246, 1)';
      navbarContainer.style.transform = 'scale(1.1)';
      navbarValue.style.fontSize = '16px';
      navbarValue.style.color = '#3b82f6';

      setTimeout(() => {
        navbarContainer.style.boxShadow = '';
        navbarContainer.style.transform = '';
        navbarValue.style.fontSize = '';
        navbarValue.style.color = '';
      }, 2000);
    }
  }, 200);

  // Highlight the changes
  highlightUpdatedElements(symbol, action);
}

// Show action feedback in a prominent banner at top of page with value changes
function showActionFeedback(action, symbol, quantity, price, details, changes) {
  const color = action === 'BUY' ? '#10b981' : '#ef4444';
  const bgColor = action === 'BUY' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
  const icon = action === 'BUY' ? 'fa-arrow-up' : 'fa-arrow-down';

  // Create or update feedback banner
  let banner = document.getElementById('actionFeedbackBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'actionFeedbackBanner';
    banner.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      border: 2px solid ${color};
      border-radius: 12px;
      padding: 20px 28px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      z-index: 9999;
      min-width: 500px;
      max-width: 700px;
      animation: slideDown 0.3s ease-out;
    `;
    document.body.appendChild(banner);
  }

  banner.style.borderColor = color;

  // Format change indicators
  const formatChange = (value) => {
    const isPositive = value >= 0;
    const sign = isPositive ? '+' : '';
    return `<span style="color: ${isPositive ? '#10b981' : '#ef4444'}; font-weight: 600;">${sign}${formatCurrency(value)}</span>`;
  };

  banner.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 16px;">
      <div style="width: 56px; height: 56px; background: ${bgColor}; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <i class="fas ${icon}" style="color: ${color}; font-size: 28px;"></i>
      </div>
      <div style="flex: 1;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
          <div>
            <div style="font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">
              ${action} ${symbol}
            </div>
            <div style="font-size: 14px; color: #64748b;">
              ${quantity} shares @ ${formatCurrency(price)} · ${details}
            </div>
          </div>
          <button onclick="document.getElementById('actionFeedbackBanner').remove()"
                  style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 20px; padding: 4px; margin-left: 12px;">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 12px; margin-top: 12px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
            <div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Portfolio Value</div>
              <div style="font-size: 16px; font-weight: 700; color: #1e293b;">${formatCurrency(changes.newTotalValue)}</div>
              <div style="font-size: 12px; margin-top: 2px;">${formatChange(changes.valueChange)}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Total Investment</div>
              <div style="font-size: 16px; font-weight: 700; color: #1e293b;">${formatCurrency(changes.newTotalInvestment)}</div>
              <div style="font-size: 12px; margin-top: 2px;">${formatChange(changes.investmentChange)}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Total Gain/Loss</div>
              <div style="font-size: 16px; font-weight: 700; color: ${changes.newGainLoss >= 0 ? '#10b981' : '#ef4444'};">
                ${formatCurrency(changes.newGainLoss)}
              </div>
              <div style="font-size: 12px; margin-top: 2px;">${formatChange(changes.gainLossChange)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add animation styles if not exists
  if (!document.getElementById('actionAnimationStyles')) {
    const style = document.createElement('style');
    style.id = 'actionAnimationStyles';
    style.textContent = `
      @keyframes slideDown {
        from { top: -100px; opacity: 0; }
        to { top: 80px; opacity: 1; }
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
        50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
      }
      @keyframes highlight {
        0% { background-color: rgba(250, 204, 21, 0.3); }
        100% { background-color: transparent; }
      }
      @keyframes valueChange {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;
    document.head.appendChild(style);
  }

  // Animate value changes
  setTimeout(() => {
    const valueElements = banner.querySelectorAll('[style*="font-size: 16px"]');
    valueElements.forEach(el => {
      el.style.animation = 'valueChange 0.5s ease-out';
    });
  }, 100);

  // Auto-remove after 8 seconds (longer to see the values)
  setTimeout(() => {
    if (banner && banner.parentElement) {
      banner.style.transition = 'opacity 0.3s, top 0.3s';
      banner.style.opacity = '0';
      banner.style.top = '-100px';
      setTimeout(() => banner.remove(), 300);
    }
  }, 8000);
}

// Highlight updated elements with animation
function highlightUpdatedElements(symbol, action) {
  // Highlight portfolio table row
  setTimeout(() => {
    const portfolioRows = document.querySelectorAll('.stock-table-row');
    portfolioRows.forEach(row => {
      const symbolText = row.querySelector('div[style*="font-weight: 600"]');
      if (symbolText && symbolText.textContent === symbol) {
        row.style.animation = 'highlight 2s ease-out';
        row.style.border = '2px solid #fbbf24';
        setTimeout(() => {
          row.style.animation = '';
          row.style.border = '';
        }, 2000);
      }
    });

    // Highlight navbar "Your Investment" section
    const navbarInvestment = document.getElementById('yourInvestment');
    if (navbarInvestment) {
      navbarInvestment.style.transition = 'all 0.5s ease-out';
      navbarInvestment.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.8)';
      navbarInvestment.style.transform = 'scale(1.08)';
      navbarInvestment.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))';

      // Add a visual "UPDATED" indicator
      const updateBadge = document.createElement('div');
      updateBadge.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: linear-gradient(135deg, #10b981, #3b82f6);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 9px;
        font-weight: 700;
        z-index: 1000;
        animation: pulse 1s ease-out infinite;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
      `;
      updateBadge.textContent = '✓ UPDATED';

      navbarInvestment.style.position = 'relative';
      navbarInvestment.appendChild(updateBadge);

      setTimeout(() => {
        navbarInvestment.style.boxShadow = '';
        navbarInvestment.style.transform = '';
        navbarInvestment.style.background = 'linear-gradient(135deg,#f8fafc,#e2e8f0)';
        updateBadge.remove();
      }, 3000);
    }

    // Highlight and animate summary cards with value changes
    const summaryCards = document.querySelectorAll('.summary-card, .card');
    summaryCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = 'pulse 1s ease-out';
        card.style.transform = 'scale(1.02)';
        card.style.transition = 'transform 0.3s ease-out';

        // Add a "UPDATED" badge temporarily
        const badge = document.createElement('div');
        badge.style.cssText = `
          position: absolute;
          top: -8px;
          right: -8px;
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          z-index: 10;
          animation: pulse 1s ease-out;
        `;
        badge.textContent = 'UPDATED';

        const parent = card.style.position === 'relative' ? card : (() => {
          card.style.position = 'relative';
          return card;
        })();

        parent.appendChild(badge);

        setTimeout(() => {
          card.style.animation = '';
          card.style.transform = '';
          badge.remove();
        }, 2000);
      }, index * 100);
    });

    // Flash the "Your Investment" summary with special attention
    const investmentCard = document.querySelector('#yourInvestmentValue')?.closest('.card, .summary-card');
    if (investmentCard) {
      investmentCard.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.5)';
      setTimeout(() => {
        investmentCard.style.transition = 'box-shadow 1s ease-out';
        investmentCard.style.boxShadow = '';
      }, 2000);
    }

    // Scroll to portfolio section
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 100);
}

// Comprehensive refresh function - updates EVERYTHING dynamically
function refreshAllDisplays() {
  console.log('🔄 refreshAllDisplays called');

  // Update portfolio displays with forced re-render
  const summary = calculatePortfolioSummary(demoPortfolioData);

  console.log('📊 Calculated summary:', summary);

  // Force update summary cards with DOM manipulation
  const totalValueEl = document.getElementById('totalValue');
  const totalInvestmentEl = document.getElementById('totalInvestment');
  const totalGainLossEl = document.getElementById('totalGainLoss');
  const totalItemsEl = document.getElementById('totalItems');

  if (totalValueEl) {
    totalValueEl.textContent = formatCurrency(summary.totalValue);
    console.log('✅ Updated totalValue:', totalValueEl.textContent);
  }
  if (totalInvestmentEl) {
    totalInvestmentEl.textContent = formatCurrency(summary.totalInvestment);
    console.log('✅ Updated totalInvestment:', totalInvestmentEl.textContent);
  }
  if (totalGainLossEl) {
    totalGainLossEl.textContent = (summary.totalGainLoss >= 0 ? '+' : '') + formatCurrency(summary.totalGainLoss);
    totalGainLossEl.style.color = summary.totalGainLoss >= 0 ? '#10b981' : '#ef4444';
    console.log('✅ Updated totalGainLoss:', totalGainLossEl.textContent);
  }
  if (totalItemsEl) {
    totalItemsEl.textContent = summary.itemCount;
    console.log('✅ Updated totalItems:', totalItemsEl.textContent);
  }

  // Update the gain indicator with proper icon classes
  const gainIndicator = document.getElementById('totalGainIndicator');
  if (gainIndicator) {
    const isPositive = summary.totalGainLoss >= 0;
    gainIndicator.className = `gain-indicator ${isPositive ? 'up' : 'down'}`;
    const icon = gainIndicator.querySelector('i');
    const text = gainIndicator.querySelector('span');
    if (icon) icon.className = `fas fa-arrow-${isPositive ? 'up' : 'down'}`;
    if (text) text.textContent = `${isPositive ? '+' : ''}${summary.gainLossPercent.toFixed(2)}%`;
    console.log('✅ Updated gainIndicator:', {
      isPositive,
      percentage: summary.gainLossPercent.toFixed(2) + '%',
      gainLoss: summary.totalGainLoss
    });
  } else {
    console.error('❌ totalGainIndicator element not found!');
  }

  // Force update portfolio table
  renderPortfolioTable(demoPortfolioData);
  console.log('✅ Portfolio table rendered');

  // Update Your Investment header
  updateYourInvestmentSummary();
  console.log('✅ Navbar updated');

  // Update charts - these are dynamic and reflect current data
  renderAllocationChart(demoPortfolioData);
  renderPerformanceChart(demoPortfolioData);
  console.log('✅ Charts updated');

  // Update all lists
  loadOrders();
  loadWatchlist();
  loadTopGainersSuggestions();
  loadTopMarketMovers();
  renderMarketData(demoMarketData);
  console.log('✅ All lists updated');

  console.log('✅ All displays refreshed with current data', {
    totalValue: summary.totalValue,
    totalInvestment: summary.totalInvestment,
    totalGainLoss: summary.totalGainLoss,
    items: summary.itemCount
  });
}

function deletePosition(id) {
  if (confirm('Are you sure you want to delete this position?')) {
    const index = demoPortfolioData.findIndex(p => p.id === id);
    if (index !== -1) {
      const deleted = demoPortfolioData[index];
      demoPortfolioData.splice(index, 1);
      console.log(`✅ Position deleted: ${deleted.tickerSymbol}`);
      refreshAllDisplays();
    }
  }
}

// Navigation
function showSection(section) {
  const target = document.getElementById(section);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Search Function
function handleGlobalSearch(event) {
  const query = event.target.value.toLowerCase().trim();
  
  if (!query) {
    // Reset to show all data
    renderPortfolioTable(demoPortfolioData);
    renderMarketData(demoMarketData);
    loadTopGainersSuggestions();
    loadTopMarketMovers();
    loadWatchlist();
    return;
  }

  // Search in portfolio
  const filteredPortfolio = demoPortfolioData.filter(item =>
    item.tickerSymbol.toLowerCase().includes(query) ||
    item.assetName.toLowerCase().includes(query) ||
    item.assetType.toLowerCase().includes(query)
  );
  renderPortfolioTable(filteredPortfolio);

  // Search in market data
  const filteredMarket = demoMarketData.filter(stock =>
    stock.symbol.toLowerCase().includes(query) ||
    stock.name.toLowerCase().includes(query)
  );
  renderMarketData(filteredMarket);

  // Search in all data sources
  const allStocks = [
    ...demoPortfolioData.map(s => ({ symbol: s.tickerSymbol, name: s.assetName })),
    ...demoMarketData,
    ...topGainersData,
    ...topLosersData,
    ...demoWatchlistData
  ];

  const uniqueResults = allStocks.filter((stock, index, self) =>
    (stock.symbol.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query)) &&
    index === self.findIndex(s => s.symbol === stock.symbol)
  );

  // Show results in console for debugging
  console.log(`Search results for "${query}":`, uniqueResults);

  // Auto-scroll to portfolio section if results found
  if (uniqueResults.length > 0) {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection && filteredPortfolio.length > 0) {
      portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

// Utility Functions
function formatCurrency(amount) {
  const curr = appPrefs.currency in CURRENCIES ? appPrefs.currency : 'USD';
  const meta = CURRENCIES[curr];
  const usdAmount = Number(amount || 0);
  const converted = usdAmount * meta.rateFromUSD;
  return new Intl.NumberFormat(meta.locale, {
    style: 'currency',
    currency: curr,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(converted);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => { clearTimeout(timeout); func(...args); };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Toggle Sidebar
function toggleSidebar() {
  document.body.classList.toggle('sidebar-open');
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.classList.toggle('active');
}

// Refresh All Data
async function refreshAllData() {
  await refreshMarketData();
  refreshSuggestions();
  loadTopMarketMovers();
  loadSectorsTrending();
  loadStocksInNews();
  loadOrders();
  loadWatchlist();
  updateYourInvestmentSummary();
  loadDemoData();
  console.log('✅ All data refreshed');
}

// Toast Notification - DISABLED (removed per user request)
function showToast(message, type = 'success') {
  // Notifications removed - changes show directly on page
  return;
}

// Make functions globally available
window.showSection = showSection;
window.editPosition = editPosition;
window.deletePosition = deletePosition;
window.quickTrade = quickTrade;
window.showAddModal = showAddModal;
window.closeModal = closeModal;
window.closeQuantityModal = closeQuantityModal;
window.confirmQuantity = confirmQuantity;
window.updateQuantityTotal = updateQuantityTotal;
window.refreshMarketData = refreshMarketData;
window.refreshAllData = refreshAllData;
window.refreshAllDisplays = refreshAllDisplays;
window.refreshSuggestions = refreshSuggestions;
window.refreshNews = refreshNews;
window.addToWatchlist = addToWatchlist;
window.removeFromWatchlist = removeFromWatchlist;
window.toggleWatchlist = toggleWatchlist;
window.isInWatchlist = isInWatchlist;
window.toggleSidebar = toggleSidebar;
window.updateChartPeriod = updateChartPeriod;
window.handleFormSubmit = handleFormSubmit;
window.toggleNews = toggleNews;
window.refreshAllData = refreshAllData;
window.refreshSuggestions = refreshSuggestions;
window.refreshNews = refreshNews;
window.addToWatchlist = addToWatchlist;
window.toggleSidebar = toggleSidebar;
window.updateChartPeriod = updateChartPeriod;
window.handleFormSubmit = handleFormSubmit;

// Yahoo Finance API Integration (mock for demo)
async function fetchStockQuote(symbol) {
  try {
    return {
      symbol: symbol,
      price: Math.random() * 500 + 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
}

async function fetchTopGainers() { return topGainersData; }
async function fetchTopLosers() { return topLosersData; }
async function fetchSectorPerformance() { return sectorsTrendingData; }
