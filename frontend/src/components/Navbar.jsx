import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, LogOut, UserCircle, ShieldCheck, Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const location = useLocation();
  const [dark, setDark] = useState(() => localStorage.getItem("tech_theme") !== "light");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("tech_theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => setMenu(false), [location.pathname]);

  return (
    <nav className="site-nav">
      <div className="nav-shell">
        <Link className="brand" to="/"><span className="brand-mark">TN</span><span>TECH NEXUS<small>SMART TECH. BETTER LIVING.</small></span></Link>
        <button className="mobile-toggle" onClick={() => setMenu(v => !v)} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button>
        <div className={"nav-links" + (menu ? " open" : "")}>
          <Link className={location.pathname === "/" ? "active" : ""} to="/">Home</Link>
          <Link className={location.pathname.startsWith("/products") ? "active" : ""} to="/products">Shop</Link>
          {user && <Link to="/orders">Orders</Link>}
          <Link className="nav-cart" to="/cart"><ShoppingCart size={17}/>Cart<b>{count}</b></Link>
          <button className="theme-toggle" onClick={() => setDark(v => !v)} aria-label="Toggle theme">{dark ? <Sun size={17}/> : <Moon size={17}/>}</button>
          {user ? (
            <div className="nav-user"><span className="avatar">{user.name?.charAt(0)?.toUpperCase() || "U"}</span><span className="user-name">{user.name}</span><ChevronDown size={15}/>
              <div className="user-menu">{user.role === "admin" && <Link to="/admin"><ShieldCheck size={15}/>Admin Studio</Link>}<button onClick={logout}><LogOut size={15}/>Logout</button></div>
            </div>
          ) : <Link className="login-pill" to="/login"><UserCircle size={17}/>Login</Link>}
        </div>
      </div>
    </nav>
  );
}