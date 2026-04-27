import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({ userId: {type:mongoose.Schema.Types.ObjectId, ref: "User", required:true}, stockSymbol: { type: String, required: true }, type: { type: String, required: true, enum: ["BUY", "SELL"] }, quantity: { type: Number, required: true }, price: { type: Number, required: true }, status: { type: String, required: true, enum: ["PENDING", "EXECUTED", "CANCELLED"], default: "EXECUTED" } }, { timestamps: true });

export default mongoose.model("Order",orderSchema);