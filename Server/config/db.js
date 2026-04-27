//Its work is to connect to the mongodb database when server starts

import mongoose from "mongoose";

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected")
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        })
    } catch (error) {
        console.error(error.message);
        process.exit(1); //to kill the server
    }
}

export default connectDB;