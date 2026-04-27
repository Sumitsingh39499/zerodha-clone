import { getWatchlist,addToWatchlist,removeWatchlist } from "../controllers/watchlistController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const Router = express.Router();
Router.get("/", protect , getWatchlist);
Router.post("/", protect , addToWatchlist);
Router.delete("/:symbols", protect , removeWatchlist)

export default Router;