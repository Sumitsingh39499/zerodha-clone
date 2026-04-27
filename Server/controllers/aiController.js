import {GoogleGenerativeAI} from "@google/generative-ai"
import Portfolio from "../models/Portfolio.js"
import Stock from "../models/Stock.js"

export const analyzePortfolio = async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

        const holdings = await Portfolio.find({ userId: req.user.id })
        if (holdings.length === 0) {
            return res.status(400).json({ message: "No holdings to analyze" })
        }

        const holdingsData = await Promise.all(
            holdings.map(async (h) => {
                const stock = await Stock.findOne({ symbol: h.stockSymbol })
                const currentPrice = stock ? stock.currentPrice : 0
                const pnl = (currentPrice - h.avgBuyPrice) * h.quantity
                return `${h.stockSymbol}: ${h.quantity} shares, avg price ₹${h.avgBuyPrice}, current ₹${currentPrice}, P&L ₹${pnl.toFixed(2)}`
            })
        )

        const prompt = `You are a stock market expert. Analyze this Indian stock portfolio and give brief actionable advice in 3-4 lines:\n${holdingsData.join("\n")}`

        const result = await model.generateContent(prompt)
        const text = result.response.text()

        return res.status(200).json({ analysis: text })
    } catch (err) {
    console.error("AI ERROR:", err.message)
    return res.status(500).json({ message: err.message })
}
}

