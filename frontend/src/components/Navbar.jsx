import { Link } from "react-router-dom";
import { ShoppingCart, LogOut, UserCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  return (
    <nav>
      <Link className="brand" to="/">
        TECH NEXUS<span>EST. 2012</span>
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart" className="cart-link">
          <ShoppingCart size={17} /> Cart <b>{count}</b>
        </Link>
        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            {user.role === "admin" && (
              <Link to="/admin">
                <ShieldCheck size={16} /> Admin
              </Link>
            )}
            <button className="nav-button" onClick={logout}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <UserCircle size={17} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}
