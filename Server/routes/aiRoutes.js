import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {analyzePortfolio} from "../controllers/aiController.js"

const Router = express.Router();

Router.get("/analyze",protect,analyzePortfolio)

export default Router;