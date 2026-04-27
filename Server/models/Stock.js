import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({ symbol: { type: String, required: true, unique: true }, name: { type: String, required: true }, currentPrice: { type: Number, required: true }, previousClose: { type: Number }, change: { type: Number }, changePercent: { type: Number } }, { timestamps: true });

export default mongoose.model("Stock", stockSchema);