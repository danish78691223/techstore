import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
export default function Checkout() {
  const { items, total, clear } = useCart();
  const [address, setAddress] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/orders", {
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        address,
      });
      clear();
      nav("/orders");
    } catch (x) {
      setError(x.response?.data?.message || "Order failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="container page">
      <h1>Checkout</h1>
      <div className="checkout">
        <form className="form-card" onSubmit={submit}>
          <h2>Delivery Details</h2>
          {error && <div className="error">{error}</div>}
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Full delivery address"
          />
          <button className="primary" disabled={busy}>
            {busy ? "Placing Order..." : "Place COD Order"}
          </button>
        </form>
        <aside className="summary">
          <h2>Total</h2>
          <div className="total">
            <span>Payable</span>
            <strong>Rs {total.toLocaleString("en-IN")}</strong>
          </div>
          <p>Payment method: Cash on Delivery</p>
        </aside>
      </div>
    </main>
  );
}
