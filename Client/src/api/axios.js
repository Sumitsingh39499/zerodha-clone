import axios from "axios";
import { store } from "../store/store.js"
import { setCredentials, logout } from "../store/authSlice.js"

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = store.getState().auth.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
});

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response?.status === 401) {
            try {
                //call refresh endpoint:
                const { data } = await axios.post(
                    "http://localhost:5000/api/auth/refresh",
                    {},
                    { withCredentials: true }
                )
                //dispatch setCredentials with new token:
                store.dispatch(setCredentials({
                    ...store.getState().auth,
                    accessToken: data.accessToken
                }))
                // retry original request
                err.config.headers.Authorization = `Bearer ${data.accessToken}`
                return api(err.config)
            } catch {
                store.dispatch(logout())
            }
        }
        return Promise.reject(err)
    }
);

export default api;