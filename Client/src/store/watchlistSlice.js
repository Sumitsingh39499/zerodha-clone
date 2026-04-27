import { createSlice } from "@reduxjs/toolkit";

const watchlistSlice = createSlice({
    name:"watchlist",
    initialState: { symbols: [] },  
    reducers: {
    setWatchlist: (state, action) => {
        state.symbols = action.payload
    },
    addSymbol: (state, action) => {
        state.symbols.push(action.payload)
    },
    removeSymbol: (state, action) => {
        state.symbols = state.symbols.filter(s => s !== action.payload)
    }
}
})

export const { setWatchlist,addSymbol,removeSymbol  } = watchlistSlice.actions;
export default watchlistSlice.reducer;