import { useState, useEffect } from "react"
import api from "../api/axios.js"
import { useNavigate } from "react-router-dom"
import "../orderHistory.css"

const OrderHistory = () => {
    const [orders, setOrders] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await api.get("/portfolio/order")
            setOrders(data)
        }
        fetchOrders()
    }, [])

    return (
        <div className="dashboard">
            <div className="navbar">
                <h1>Order History</h1>
                <button className="btn-logout" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Stock</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order.stockSymbol}</td>
                                <td className={order.type === "BUY" ? "type-buy" : "type-sell"}>
                                    {order.type}
                                </td>
                                <td>{order.quantity}</td>
                                <td>₹{order.price}</td>
                                <td>₹{(order.price * order.quantity).toFixed(2)}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderHistory