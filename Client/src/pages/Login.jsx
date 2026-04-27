import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import api from "../api/axios.js"
import { setCredentials } from "../store/authSlice.js"
import "../App.css"



const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const handleSubmit = async () => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            dispatch(setCredentials(data));
            navigate("/dashboard");
        } catch (err) { alert("Login failed") }
    }
    return (
    <div className="login-container">
  <div className="login-card">
    <h2 className="login-title" >Zerodha Clone</h2>
    <input className="input-field" type="text" placeholder="Email"  onChange={(e) => setEmail(e.target.value)}  />
    <input className="input-field" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}  />
    <button className="btn-primary" onClick={handleSubmit}>Login</button>
    <p className="login-footer">
        Don't have an account? <Link to="/register" className="link">Register</Link>
      </p>
  </div>
</div>
)
}

export default Login