import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { buyStock,sellStock } from "../controllers/orderController.js";

const Router = express.Router();
Router.post("/buy",protect,buyStock);
Router.post("/sell",protect,sellStock);

export default Router;