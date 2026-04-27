//manages your auth state in Redux — who is logged in, what their token is
import {createSlice} from "@reduxjs/toolkit"

const authSlice = createSlice({
  name: "auth",
  initialState: { 
    user: JSON.parse(localStorage.getItem("user")) || null, 
    token: localStorage.getItem("token") || null, 
    loading: false 
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.accessToken
      localStorage.setItem("token", action.payload.accessToken)
      localStorage.setItem("user", JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    },
  },
})



export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;