import Order from "../models/Order.js";
import Stock from "../models/Stock.js";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js"

//buystock
export const buyStock = async (req, res) => {
    try {
        const symbol = req.body.stockSymbol;
        const quantity = req.body.quantity;

        const stock = await Stock.findOne({ symbol: symbol });
        if (!stock) return res.status(404).json("stock is not found");

        const totalCost = stock.currentPrice * quantity;

        const user = await User.findById(req.user.id);
        if (user.balance < totalCost) return (res.status(400).json("Insufficient balance"));

        await Order.create({
            userId: req.user.id,
            stockSymbol: symbol,
            type: "BUY",
            quantity,
            price: stock.currentPrice
        })
        //after buying updating the balance
        await User.findByIdAndUpdate(req.user.id, {
            balance: user.balance - totalCost
        })
        //checking if user have stock of the symbols erlier or not
        const existing = await Portfolio.findOne({ userId: req.user.id, stockSymbol: symbol })

        if (existing) {
            // recalculate average buy price
            const newQty = existing.quantity + quantity
            const newAvg = ((existing.avgBuyPrice * existing.quantity) + (stock.currentPrice * quantity)) / newQty
            await Portfolio.findOneAndUpdate(
                { userId: req.user.id, stockSymbol: symbol },
                { quantity: newQty, avgBuyPrice: newAvg }
            )
        } else {
            // create new portfolio entry
            await Portfolio.create({
                userId: req.user.id,
                stockSymbol: symbol,
                quantity,
                avgBuyPrice: stock.currentPrice
            })
        }
        return res.status(200).json({ message: "Stock bought successfully" })


    } catch (err) { return res.status(500).json({ message: err.message }) };

};

//sellstock
export const sellStock = async (req, res) => {
    try {
        const symbol = req.body.stockSymbol;
        const quantity = req.body.quantity;
        const user = await User.findById(req.user.id);

        const existing = await Portfolio.findOne({ userId: req.user.id, stockSymbol: symbol })
        if (!existing) return res.status(400).json({ message: "You don't own this stock" })
        if (existing.quantity < quantity) return res.status(400).json({ message: "Insufficient holdings" })

        const stock = await Stock.findOne({ symbol: symbol });
        if (!stock) return res.status(404).json("stock is not found");


        const totalPrice = stock.currentPrice * quantity;

        await Order.create({
            userId: req.user.id,
            stockSymbol: symbol,
            type: "SELL",
            quantity,
            price: stock.currentPrice
        })

        await User.findByIdAndUpdate(req.user.id, {
            balance: user.balance + totalPrice
        })

        if (existing.quantity === quantity) {
            // sold all shares — remove from portfolio
            await Portfolio.findOneAndDelete({ userId: req.user.id, stockSymbol: symbol })
        } else {
            // sold some shares — reduce quantity
            await Portfolio.findOneAndUpdate(
                { userId: req.user.id, stockSymbol: symbol },
                { quantity: existing.quantity - quantity }
            )
        }
        return res.status(200).json({ message: "Stock sold successfully" })

    } catch (err) { return res.status(500).json({ message: err.message }) };
}