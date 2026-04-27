import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import api from "../api/axios.js"
import { setCredentials } from "../store/authSlice.js"
import "../App.css"



const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name,setName]= useState("")
    const handleSubmit = async () => {
        try {
            const { data } = await api.post("/auth/register", {name, email, password });
            dispatch(setCredentials(data))  
            navigate("/dashboard");
        } catch (err) { alert("Registration failed") }
    }
    return (
        <div className="login-container">
        <div className="login-card">
            <h2 className="login-title">Zerodha Clone</h2>
            <input className="input-field" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value) } />
            <input className="input-field" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input-field" type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button className="btn-primary" type="button" placeholder="Submit" onClick={handleSubmit}>Register</button>
            <p className="login-footer">Do you have account?<Link to="/login" className="link">Login</Link></p>
            
        </div></div>
    )

}

export default Register