import { useEffect, useState } from "react";
import api from "../services/api";
export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api.get("/orders/my").then((r) => setOrders(r.data));
  }, []);
  return (
    <main className="container page">
      <h1>My Orders</h1>
      {orders.map((o) => (
        <article className="order-card" key={o._id}>
          <div>
            <strong>Order #{o._id.slice(-8).toUpperCase()}</strong>
            <span>{new Date(o.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span className={`status ${o.status.toLowerCase()}`}>
              {o.status}
            </span>
            <strong>Rs {o.total_price.toLocaleString("en-IN")}</strong>
          </div>
          <p>{o.items.map((i) => `${i.name} × ${i.quantity}`).join(" • ")}</p>
          <small>{o.address}</small>
        </article>
      ))}
      {!orders.length && <p className="empty">No orders yet.</p>}
    </main>
  );
}
