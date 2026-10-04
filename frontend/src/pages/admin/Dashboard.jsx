import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { Package,ShoppingBag,Users,IndianRupee,ArrowRight,PlusCircle,BarChart3,AlertTriangle } from "lucide-react";
import api from "../../services/api";
export default function Dashboard(){
 const [s,setS]=useState({});
 useEffect(()=>{api.get("/admin/dashboard").then(r=>setS(r.data)).catch(console.error)},[]);
 const money=n=>"Rs "+Number(n||0).toLocaleString("en-IN");
 return <div className="dashboard-page"><section className="dashboard-welcome"><div><p className="eyebrow">GOOD CONTROL, BETTER COMMERCE</p><h2>Your store at a glance.</h2><p>Keep inventory healthy, fulfil orders quickly and use the storefront as your growth engine.</p></div><div className="quick-actions"><Link to="/admin/products/add"><PlusCircle size={17}/>Add product</Link><Link to="/admin/analytics"><BarChart3 size={17}/>View analytics</Link></div></section>
 <div className="stats"><Stat icon={Package} label="Products" value={s.totalProducts??"—"}/><Stat icon={ShoppingBag} label="Orders" value={s.totalOrders??"—"}/><Stat icon={Users} label="Users" value={s.totalUsers??"—"}/><Stat icon={IndianRupee} label="Revenue" value={money(s.revenue)}/></div>
 <div className="dashboard-grid"><section className="panel"><div className="panel-title"><h3>Operations</h3><ArrowRight size={17}/></div><div className="ops-row"><span>Low-stock products</span><b>{s.lowStock??0}</b></div><div className="ops-row"><span>Orders waiting to fulfil</span><b>{s.totalOrders??0}</b></div><p className="muted">Open Products or Orders from the sidebar to act on these signals.</p></section><section className="panel"><div className="panel-title"><h3>Next best actions</h3></div><Link className="action-link" to="/admin/products/add">Launch a new product listing <ArrowRight size={15}/></Link><Link className="action-link" to="/admin/orders">Process the latest orders <ArrowRight size={15}/></Link><Link className="action-link" to="/admin/analytics">Review revenue and demand <ArrowRight size={15}/></Link></section></div>
 {Number(s.lowStock||0)>0&&<div className="alert-banner"><AlertTriangle size={18}/><span><b>Inventory attention needed.</b> {s.lowStock} product(s) have 5 or fewer units remaining.</span><Link to="/admin/products">Review stock</Link></div>}
 </div>;
}
function Stat({icon:Icon,label,value}){return <div><div className="stat-icon"><Icon size={18}/></div><span>{label}</span><b>{value}</b></div>}