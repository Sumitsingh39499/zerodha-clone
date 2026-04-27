import {createSlice} from "@reduxjs/toolkit";


const portfolioSlice = createSlice({
    name:"portfolio",
    initialState: { holdings: [] },
    reducers:{setHoldings: (state,action)=>{
        state.holdings = action.payload
    }}
})


export const { setHoldings } = portfolioSlice.actions;
export default portfolioSlice.reducer;