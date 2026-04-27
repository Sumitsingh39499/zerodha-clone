//see it
import Portfolio from "../models/Portfolio.js";
import Stock from "../models/Stock.js";
import Orders from "../models/Order.js";


export const getPortfoilo = async (req, res) => {
    try {
        const holdings = await Portfolio.find({ userId: req.user.id });

        const result = await Promise.all(
            holdings.map(async (holding) => {
                const stock = await Stock.findOne({ symbol: holding.stockSymbol })
                const currentPrice = stock ? stock.currentPrice : 0
                const pnl = (currentPrice - holding.avgBuyPrice) * holding.quantity
                return {
                    stockSymbol: holding.stockSymbol,
                    quantity: holding.quantity,
                    avgBuyPrice: holding.avgBuyPrice,
                    currentPrice,
                    pnl
                }
            })
        )
        return res.status(200).json(result)

    } catch (err) { return res.status(500).json({ message: err.message }) }
};


export const getOrderHistory = async (req, res) => {
    try {
        const orders = await Orders.find({ userId: req.user.id }).sort({ createdAt: -1 })
        return res.status(200).json(orders)
    } catch (err) { return res.status(500).json({ message: err.message }) }
}