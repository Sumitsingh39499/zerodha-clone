//see it
import { useState } from "react"
import api from "../api/axios.js"
import { setWatchlist } from "../store/watchlistSlice.js"
import { setHoldings } from "../store/portfolioSlice.js"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import socket from "../socket.js"
import { updatePrices } from "../store/stockSlice.js"
import { addSymbol, removeSymbol } from "../store/watchlistSlice.js"
import TradeModal from "../components/TradeModal.jsx"
import { logout } from "../store/authSlice.js"
import { useNavigate } from "react-router-dom"
import StockChart from "../components/StockChart.jsx"
import "../Dashboard.css"

const Dashboard = () => {

    const [selectedStock, setSelectedStock] = useState(null)
    const [tradeType, setTradeType] = useState("BUY")
    const [showModal, setShowModal] = useState(false)
    const [searchSymbol, setSearchSymbol] = useState("")
    const [aiAnalysis, setAiAnalysis] = useState("")
    const [aiLoading, setAiLoading] = useState(false)
    const [chartSymbol, setChartSymbol] = useState(null)


    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { prices } = useSelector(state => state.stock)
    const { symbols } = useSelector(state => state.watchlist)
    const { holdings } = useSelector(state => state.portfolio)
    const { user } = useSelector(state => state.auth)


    useEffect(() => {
        const fetchData = async () => {
            const { data } = await api.get("/watchlist")
            dispatch(setWatchlist(data.symbols))
            const res = await api.get("/portfolio")
            dispatch(setHoldings(res.data))
        }
        fetchData();
        socket.on("priceUpdate", (prices) => {
            dispatch(updatePrices(prices))
        })

        return () => socket.off("priceUpdate")
    }, [])

    const handleAddToWatchlist = async () => {
        if (!searchSymbol) return
        await api.post("/watchlist", { symbols: searchSymbol })
        dispatch(addSymbol(searchSymbol.toUpperCase()))
        setSearchSymbol("")
    }

    const handleRemove = async (symbol) => {
        await api.delete(`/watchlist/${symbol}`)
        dispatch(removeSymbol(symbol))
    }

    const handleTrade = (symbol, type) => {
        setSelectedStock(symbol)
        setTradeType(type)
        setShowModal(true)
    }

    const handleAnalyze = async () => {
        setAiLoading(true)
        try {
            const { data } = await api.get("/ai/analyze")
            setAiAnalysis(data.analysis)
        } catch (err) {
            alert("Analysis failed")
        }
        setAiLoading(false)
    }

    return (
        <div className="dashboard">
            <div className="navbar">
                <h1>Zerodha Clone</h1>
                <div className="navbar-right">
                    <span className="balance">₹{user?.balance}</span>
                    <button className="btn-logout" onClick={() => { dispatch(logout()); navigate("/login") }}>Logout</button>
                    <button className="btn-logout" onClick={() => navigate("/orders")}>Order History</button>
                </div>
            </div>

            <div className="dashboard-body">
                <div className="watchlist-section">
                    <h2>Watchlist</h2>
                    <div className="search-bar">
                        <input value={searchSymbol} onChange={(e) => setSearchSymbol(e.target.value)} placeholder="e.g. TCS" />
                        <button className="btn-add" onClick={handleAddToWatchlist}>Add</button>
                    </div>
                    {symbols.map(symbol => {
                        const live = prices.find(p => p.symbol === symbol)
                        return (
                            <div key={symbol} className="watchlist-item">
                                <span
                                    className="stock-symbol"
                                    onClick={() => setChartSymbol(symbol)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {symbol}
                                </span>
                                <span className="stock-price">₹{live?.currentPrice || "..."}</span>
                                <div className="item-actions">
                                    <button className="btn-buy" onClick={() => handleTrade(symbol, "BUY")}>Buy</button>
                                    <button className="btn-sell" onClick={() => handleTrade(symbol, "SELL")}>Sell</button>
                                    <button className="btn-remove" onClick={() => handleRemove(symbol)}>✕</button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="portfolio-section">
                    <h2>Portfolio</h2>
                    {holdings.map(h => (
                        <div key={h.stockSymbol} className="portfolio-item">
                            <span>{h.stockSymbol}</span>
                            <span>Qty: {h.quantity}</span>
                            <span>Avg: ₹{h.avgBuyPrice}</span>
                            <span className={h.pnl >= 0 ? "pnl-positive" : "pnl-negative"}>
                                P&L: ₹{h.pnl?.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {
                showModal && (
                    <div className="modal-overlay">
                        <TradeModal
                            symbol={selectedStock}
                            type={tradeType}
                            onClose={() => setShowModal(false)}
                            onSuccess={async () => {
                                const res = await api.get("/portfolio")
                                dispatch(setHoldings(res.data))
                            }}
                        />
                    </div>
                )
            }

            {chartSymbol && (
                <div className="chart-section">
                    <button onClick={() => setChartSymbol(null)} className="btn-remove">
                        Close Chart
                    </button>
                    <StockChart symbol={chartSymbol} />
                </div>
            )}
            {/* AI Analysis */}
            <div className="ai-section">
                <button className="btn-ai" onClick={handleAnalyze}>
                    {aiLoading ? "Analyzing..." : "Analyze My Portfolio (AI)"}
                </button>
                {aiAnalysis && (
                    <div className="ai-result">
                        <h3>AI Analysis</h3>
                        <p>{aiAnalysis}</p>
                    </div>
                )}
            </div>
        </div >
    )
}


export default Dashboard;