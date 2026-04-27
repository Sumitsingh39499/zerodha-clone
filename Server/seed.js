import dotenv from "dotenv";
import mongoose from "mongoose";
import Stock from "./models/Stock.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI)

const stocks = [
  { symbol: "RELIANCE", name: "Reliance Industries", currentPrice: 2850, previousClose: 2820 },
  { symbol: "TCS", name: "Tata Consultancy Services", currentPrice: 3940, previousClose: 3900 },
  { symbol: "INFY", name: "Infosys", currentPrice: 1820, previousClose: 1800 },
  { symbol: "HDFCBANK", name: "HDFC Bank", currentPrice: 1650, previousClose: 1630 },
  { symbol: "ICICIBANK", name: "ICICI Bank", currentPrice: 1120, previousClose: 1100 },
  { symbol: "WIPRO", name: "Wipro", currentPrice: 480, previousClose: 475 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", currentPrice: 6800, previousClose: 6750 },
  { symbol: "TATAMOTORS", name: "Tata Motors", currentPrice: 980, previousClose: 960 },
  { symbol: "ADANIENT", name: "Adani Enterprises", currentPrice: 2400, previousClose: 2380 },
  { symbol: "SBIN", name: "State Bank of India", currentPrice: 810, previousClose: 800 },
]

await Stock.deleteMany({})
await Stock.insertMany(
  stocks.map(s => ({
    ...s,
    change: s.currentPrice - s.previousClose,
    changePercent: ((s.currentPrice - s.previousClose) / s.previousClose * 100).toFixed(2)
  }))
)

console.log("Stocks seeded!")
process.exit()