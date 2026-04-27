//store live prices from socket.io
import {createSlice} from "@reduxjs/toolkit";
const stockSlice = createSlice({
    name:"stock",
    initialState: { prices: [] },
    reducers: {updatePrices: (state,action) =>{
        state.prices = action.payload
    }}
})

export const { updatePrices } = stockSlice.actions;
export default stockSlice.reducer;