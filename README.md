# 📈 Zerodha Clone — Full Stack Stock Trading App

A full-stack stock trading SaaS inspired by Zerodha, built with the MERN stack. Features real-time live price feeds, a working order engine, AI-powered portfolio analysis, and JWT authentication.

🔗 **Live Demo:** [zerodha-clone-delta-dun.vercel.app](https://zerodha-clone-delta-dun.vercel.app)

---

## 🚀 Features

- **JWT Authentication** — Register, Login, Logout with access + refresh token strategy
- **Live Price Feed** — Real-time stock price updates every 2 seconds via Socket.io
- **Watchlist** — Add and remove stocks with live ticking prices
- **Order Engine** — Buy and sell stocks with balance validation and holdings check
- **Portfolio Tracking** — View holdings with average buy price and P&L calculation
- **AI Portfolio Analysis** — Gemini AI analyzes your portfolio and gives actionable advice
- **Order History** — View all past buy/sell orders sorted by date
- **Candlestick Charts** — Interactive price charts for each stock
- **Dark UI** — Professional dark theme inspired by real trading platforms

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Redux Toolkit (state management)
- Socket.io Client (real-time prices)
- Lightweight Charts (candlestick charts)
- CSS (custom dark theme)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io (WebSocket server)
- JSON Web Tokens (JWT)
- Google Gemini API (AI analysis)
- Bcryptjs (password hashing)
- Cookie Parser (refresh token storage)

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## 📸 Screenshots

### Login Page
Clean dark login UI with email/password authentication.

### Dashboard
- Left panel: Watchlist with live ticking prices
- Right panel: Portfolio holdings with P&L
- Bottom: AI portfolio analysis button

### Trade Modal
Buy/sell stocks with quantity input and instant portfolio update.

---

## 🗂️ Project Structure

```
zerodha-clone/
├── Client/                   # React frontend
│   ├── src/
│   │   ├── api/              # Axios instance with interceptors
│   │   ├── components/       # TradeModal, StockChart
│   │   ├── pages/            # Login, Register, Dashboard, OrderHistory
│   │   ├── store/            # Redux slices (auth, stock, watchlist, portfolio)
│   │   └── socket.js         # Socket.io client
│   └── .env                  # VITE_API_URL, VITE_SOCKET_URL
│
└── Server/                   # Node.js backend
    ├── config/               # DB connection, Passport.js
    ├── controllers/          # Auth, Watchlist, Order, Portfolio, AI
    ├── middleware/            # JWT protect middleware
    ├── models/               # User, Stock, Order, Portfolio, Watchlist
    ├── routes/               # All API routes
    └── index.js              # Express + Socket.io server
```

---

## ⚙️ Run Locally

### Prerequisites
- Node.js v20+
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone the repo
```bash
git clone https://github.com/Sumitsingh39499/zerodha-clone.git
cd zerodha-clone
```

### 2. Setup Backend
```bash
cd Server
npm install
```

Create `.env` file in `Server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

Run backend:
```bash
npm run dev
```

### 3. Seed stock data
```bash
node seed.js
```

### 4. Setup Frontend
```bash
cd ../Client
npm install
```

Create `.env` file in `Client/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run frontend:
```bash
npm run dev
```

### 5. Open in browser
```
http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |

### Watchlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/watchlist` | Get user's watchlist |
| POST | `/api/watchlist` | Add stock to watchlist |
| DELETE | `/api/watchlist/:symbol` | Remove stock from watchlist |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/buy` | Buy a stock |
| POST | `/api/orders/sell` | Sell a stock |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Get holdings with P&L |
| GET | `/api/portfolio/order` | Get order history |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ai/analyze` | AI portfolio analysis |

---

## 💡 Key Implementation Details

- **Refresh Token Strategy** — Access tokens expire in 15 mins, refresh tokens in 7 days. Axios interceptor silently refreshes tokens on 401 errors.
- **Real-time Prices** — Socket.io emits price updates every 2 seconds with ±0.1% random fluctuation per stock.
- **P&L Calculation** — `(currentPrice - avgBuyPrice) × quantity` calculated server-side using live prices.
- **Average Buy Price** — Recalculated on every additional purchase: `((oldAvg × oldQty) + (newPrice × newQty)) / totalQty`
- **Balance Validation** — Server checks `user.balance >= totalCost` before executing buy orders.
- **Holdings Validation** — Server checks sufficient quantity before executing sell orders.

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | zerodha-clone-delta-dun.vercel.app |
| Backend | Render | zerodha-clone-j23j.onrender.com |
| Database | MongoDB Atlas | Mumbai (ap-south-1) |

---

## 👨‍💻 Author

**Sumit Singh**
- GitHub: [@Sumitsingh39499](https://github.com/Sumitsingh39499)

---

## 📄 License

MIT License — feel free to use this project for learning and portfolio purposes.
