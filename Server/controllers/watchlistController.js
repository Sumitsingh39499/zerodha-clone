
import Watchlist from "../models/Watchlist.js";

export const getWatchlist = async (req, res) => {
    try {
        const find = await Watchlist.findOne({ userId: req.user.id });
        if (!find) return (res.status(200).json({ symbols: [] }));
        else { return res.status(200).json({ symbols: find.symbols }) };
    }
    catch (err) { return (res.status(500)) }

};

export const addToWatchlist = async (req, res) => {
    try {
        const symbols = req.body.symbols;
        if (!symbols) return res.status(400).json({ message: "symbol is required" });

        const updated = await Watchlist.findOneAndUpdate({ userId: req.user.id }, { $addToSet: { symbols: symbols.toUpperCase() } }, { returnDocument: 'after', upsert: true })
        return res.status(200).json(updated)
    } catch (err) { return res.status(500).json({ message: err.message }) }

};

export const removeWatchlist = async (req, res) => {
    try {

        const update = await Watchlist.findOneAndUpdate({ userId: req.user.id }, { $pull: { symbols: req.params.symbols.toUpperCase() } }, { returnDocument: 'after' })
        return res.status(200).json(update)
    } catch (err) { return res.status(500).json({ message: err.message }) }

}