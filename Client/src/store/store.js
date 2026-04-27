import authReducer from "./authSlice.js";
import { configureStore } from "@reduxjs/toolkit"
import stockReducer from "./stockSlice.js"
import watchlistReducer from "./watchlistSlice.js"
import portfolioReducer from "./portfolioSlice.js"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stock: stockReducer,
    watchlist: watchlistReducer,
    portfolio: portfolioReducer
  }
})