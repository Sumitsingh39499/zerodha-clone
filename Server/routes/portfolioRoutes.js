import express from "express";
import { protect} from "../middleware/authMiddleware.js";
import {getPortfoilo,getOrderHistory} from "../controllers/portfolioController.js";

const Router = express.Router();

Router.get("/",protect,getPortfoilo);
Router.get("/order",protect,getOrderHistory);

export default Router;