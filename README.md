# Portfolio Manager - Financial Tracking Application

A modern, multilingual portfolio management application with real-time market data integration.

## 🚀 Features

- **Real-time Market Data**: Integration with Yahoo Finance API
- **Multi-language Support**: English, Hindi, Marathi, Telugu
- **Multi-currency**: INR, USD, AED with automatic conversion
- **Portfolio Tracking**: Track stocks, ETFs, and other assets
- **Interactive Charts**: Visualize portfolio allocation and performance
- **Responsive Design**: Works seamlessly on desktop and mobile

## 📁 Project Structure

```
FRONTEND/
├── src/                      # Backend source code
│   ├── config/              # Configuration files
│   │   ├── constants.js     # App constants
│   │   └── translations.js  # Translation dictionaries
│   ├── middleware/          # Express middleware
│   │   └── index.js         # Middleware setup
│   ├── routes/              # API route handlers
│   │   ├── config.js        # Configuration endpoints
│   │   ├── currency.js      # Currency conversion
│   │   ├── market.js        # Market data
│   │   └── translate.js     # Translation endpoints
│   ├── services/            # Business logic services
│   │   ├── translationService.js
│   │   └── yahooFinanceService.js
│   ├── utils/               # Utility functions
│   │   ├── currency.js      # Currency utilities
│   │   └── translation.js   # Translation utilities
│   └── server.js            # Main server entry point
├── public/                   # Frontend static files
│   ├── js/                  # JavaScript modules
│   │   └── app.js           # Main frontend app
│   ├── css/                 # Stylesheets
│   ├── assets/              # Images and media
│   └── index.html           # Main HTML file
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
└── README.md                # This file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd FRONTEND
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Lingo.dev API key (optional - uses fallback if not provided)
LINGODOTDEV_API_KEY=your_api_key_here

# Server port
PORT=3000

# Node environment
NODE_ENV=development
```

## 📦 Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment configuration
- **node-fetch**: HTTP client (for Yahoo Finance API)
- **lingo.dev**: Translation service (optional)

## 🏗️ Architecture

### Backend (src/)

- **Config**: Centralized configuration and constants
- **Middleware**: Express middleware for CORS, body parsing, static files
- **Routes**: Modular API endpoints organized by functionality
- **Services**: Business logic and external API integrations
- **Utils**: Reusable utility functions

### Frontend (public/)

- **Single Page Application**: Vanilla JavaScript with modern ES6+
- **Responsive UI**: Tailwind CSS for styling
- **Chart.js**: Interactive data visualizations
- **Font Awesome**: Icon library

## 🔐 API Endpoints

### Configuration
- `GET /api/config` - Get app configuration

### Translation
- `POST /api/translate/text` - Translate single text
- `POST /api/translate/object` - Translate object

### Currency
- `POST /api/currency/convert` - Convert between currencies

### Market Data
- `GET /api/market/quotes?symbols=AAPL,GOOGL` - Get market quotes

## 🚀 Development

### Run in development mode
```bash
npm run dev
```

### Project Guidelines

1. **Keep modules small**: Each file should have a single responsibility
2. **Use clear naming**: File and function names should be descriptive
3. **Document code**: Add JSDoc comments for functions
4. **Handle errors**: Always include try-catch and error handling
5. **Modular structure**: Keep related code together

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Developer

Built with ❤️ for portfolio management and financial tracking.
