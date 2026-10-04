import { useEffect, useState } from "react";
import api from "../../services/api";
export default function Dashboard() {
  const [s, setS] = useState({});
  useEffect(() => {
    api.get("/admin/dashboard").then((r) => setS(r.data));
  }, []);
  return (
    <>
      <h1>Admin Dashboard</h1>
      <div className="stats">
        <div>
          <span>Products</span>
          <b>{s.totalProducts ?? "—"}</b>
        </div>
        <div>
          <span>Orders</span>
          <b>{s.totalOrders ?? "—"}</b>
        </div>
        <div>
          <span>Users</span>
          <b>{s.totalUsers ?? "—"}</b>
        </div>
        <div>
          <span>Revenue</span>
          <b>Rs {(s.revenue || 0).toLocaleString("en-IN")}</b>
        </div>
      </div>
    </>
  );
}
