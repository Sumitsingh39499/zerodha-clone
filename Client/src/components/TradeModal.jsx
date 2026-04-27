

import { useState } from "react"
import api from "../api/axios.js"
import "../TradeModal.css"

const TradeModal = ({ symbol, type, onClose, onSuccess })=>{

    const [quantity, setQuantity] = useState(1)
    const handleSubmit = async () => {
  try {
    await api.post(`/orders/${type.toLowerCase()}`, {
      stockSymbol: symbol,
      quantity: Number(quantity)
    })
    alert(`${type} order placed successfully!`)
    onSuccess()
    onClose()
  } catch(err) {
    alert("Order failed")
  }
}
return (
  <div className="modal-overlay">
  <div className="modal-card">
    <h2>{type} {symbol}</h2>
    <input
      type="number"
      value={quantity}
      min="1"
      onChange={(e) => setQuantity(e.target.value)}
      placeholder="Quantity"
    />
    <div className="modal-actions">
      <button className="btn-buy" onClick={handleSubmit}>{type}</button>
      <button className="btn-remove" onClick={onClose}>Cancel</button>
    </div>
  </div></div>
)
}

export default TradeModal;