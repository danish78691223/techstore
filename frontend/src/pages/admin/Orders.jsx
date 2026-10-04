import { useEffect, useState } from "react";
import api from "../../services/api";
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const load = () => api.get("/orders").then((r) => setOrders(r.data));
  useEffect(() => {
    load();
  }, []);
  const change = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    load();
  };
  return (
    <>
      <h1>Manage Orders</h1>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-8).toUpperCase()}</td>
                <td>
                  {o.user?.name}
                  <br />
                  <small>{o.user?.email}</small>
                </td>
                <td>Rs {o.total_price}</td>
                <td>{o.status}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => change(o._id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
