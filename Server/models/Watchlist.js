import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({ userId: {type:mongoose.Schema.Types.ObjectId, ref: "User", required:true, unique:true}, symbols:[{type:String, uppercase:true }]}, {timestamps:true})


export default mongoose.model("Watchlist",watchlistSchema);