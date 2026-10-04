import { Link, Outlet } from "react-router-dom";
export default function AdminLayout() {
  return (
    <main className="container page">
      <div className="admin-nav">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/products/add">Add Product</Link>
        <Link to="/admin/orders">Orders</Link>
      </div>
      <Outlet />
    </main>
  );
}
