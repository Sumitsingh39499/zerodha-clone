import express from  "express"; 
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
//day2
import watchlistRoutes from "./routes/watchlistRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import portfolioRoutes from "./routes/portfolioRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import http from "http"
import {Server} from "socket.io"
import Stock from "./models/Stock.js"

dotenv.config();
connectDB();

const app = express();
//http server wrapping app or express
const httpServer = http.createServer(app)

const io = new Server(httpServer,{cors:{origin:process.env.CLIENT_URL, credentials:true}})

app.use(cors({origin:process.env.CLIENT_URL, credentials:true}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/portfolio",portfolioRoutes);
app.use("/api/ai", aiRoutes)

app.get("/health",(req,res)=>{
    res.json({status : "OK"})
})



io.on("connection", (socket) => {
  console.log("Client connected")
  
  const interval = setInterval(async()  => {
    //logic
    const stocks = await Stock.find({})
    const prices = stocks.map(s => ({
        symbol: s.symbol,
        currentPrice: +(s.currentPrice * (1 + (Math.random() - 0.5) * 0.002)).toFixed(2)
    }))
    //logic emit randomness in stock price in every 2sec
    socket.emit("priceUpdate", prices)
  }, 2000)

  socket.on("disconnect", () => clearInterval(interval))
})



//app.listen(process.env.PORT,()=>{
 //   console.log(`server is running on port ${process.env.PORT}`);
//})
httpServer.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`)
})