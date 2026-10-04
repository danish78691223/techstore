import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, BarChart3, Store, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/products/add", label: "Add Products", icon: PlusCircle },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const activeTitle = links.find(x => x.to === location.pathname)?.label || "Admin Studio";
  return (
    <div className="admin-shell">
      <button className="admin-mobile-toggle" onClick={() => setOpen(v => !v)}>{open ? <X /> : <Menu />}</button>
      <aside className={"admin-sidebar" + (open ? " open" : "")}>
        <div className="admin-logo"><span className="brand-mark">TN</span><div><strong>TECH NEXUS</strong><small>ADMIN STUDIO</small></div></div>
        <div className="admin-profile"><div className="avatar large">{user?.name?.charAt(0)?.toUpperCase()}</div><div><b>{user?.name}</b><small>Administrator</small></div></div>
        <nav className="admin-nav">
          {links.map(item => { const Icon = item.icon; return <NavLink key={item.to} end={item.end} to={item.to} onClick={() => setOpen(false)} className={({isActive}) => isActive ? "active" : ""}><Icon size={18}/><span>{item.label}</span></NavLink>; })}
        </nav>
        <div className="admin-sidebar-bottom">
          <button onClick={() => navigate("/")}><Store size={17}/>Storefront</button>
          <button onClick={logout}><LogOut size={17}/>Sign out</button>
        </div>
      </aside>
      <section className="admin-content">
        <div className="admin-topbar"><div><p className="eyebrow">COMMAND CENTER</p><h1>{location.pathname === "/admin" ? "Dashboard" : activeTitle}</h1></div><div className="admin-top-meta"><span className="live-dot"></span> Store is live</div></div>
        <Outlet />
      </section>
    </div>
  );
}