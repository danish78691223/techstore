import { useEffect,useState } from "react";
import { TrendingUp,ShoppingBag,IndianRupee,Package,Users,Activity } from "lucide-react";
import api from "../../services/api";
export default function Analytics(){
 const [data,setData]=useState(null);
 useEffect(()=>{api.get("/admin/analytics").then(r=>setData(r.data)).catch(()=>setData({}));},[]);
 const money=n=>"Rs "+Number(n||0).toLocaleString("en-IN");
 const statuses=data?.ordersByStatus||[],max=Math.max(...statuses.map(x=>x.count),1);
 return <div className="analytics-page"><section className="analytics-hero"><div><p className="eyebrow">PERFORMANCE INTELLIGENCE</p><h2>Know what moves your store.</h2><p>Live metrics from products, customers and orders.</p></div><TrendingUp size={48}/></section>
 <div className="metric-grid"><Metric icon={IndianRupee} label="Gross revenue" value={money(data?.revenue)}/><Metric icon={ShoppingBag} label="Total orders" value={data?.totalOrders??"—"}/><Metric icon={Users} label="Customers" value={data?.totalUsers??"—"}/><Metric icon={Package} label="Products" value={data?.totalProducts??"—"}/></div>
 <div className="analytics-panels"><section className="panel"><div className="panel-title"><h3>Order health</h3><Activity size={18}/></div>{statuses.map(x=><div className="bar-row" key={x.status}><span>{x.status}</span><div><i style={{width:((x.count/max)*100)+"%"}}/></div><b>{x.count}</b></div>)}{!statuses.length&&<p className="muted">No orders yet. Analytics will populate as customers check out.</p>}</section>
 <section className="panel"><div className="panel-title"><h3>Top products</h3><TrendingUp size={18}/></div>{(data?.topProducts||[]).map((p,i)=><div className="top-product" key={i}><span><b>{p.name}</b><small>{p.units} units sold</small></span><strong>{money(p.revenue)}</strong></div>)}{!data?.topProducts?.length&&<p className="muted">Top products will appear after your first orders.</p>}</section></div>
 <div className="analytics-panels"><section className="panel"><div className="panel-title"><h3>Low-stock watch</h3><Package size={18}/></div>{(data?.lowStock||[]).map(p=><div className="top-product" key={p._id}><span><b>{p.name}</b><small>Rs {Number(p.price).toLocaleString("en-IN")}</small></span><strong className={p.stock===0?"danger-text":"warning-text"}>{p.stock} left</strong></div>)}{!data?.lowStock?.length&&<p className="muted">Inventory looks healthy.</p>}</section>
 <section className="panel"><div className="panel-title"><h3>Monthly revenue</h3><TrendingUp size={18}/></div>{(data?.monthlyRevenue||[]).slice(-6).map((m,i)=><div className="month-row" key={i}><span>{String(m._id.month).padStart(2,"0")}/{m._id.year}</span><strong>{money(m.revenue)}</strong></div>)}{!data?.monthlyRevenue?.length&&<p className="muted">Revenue history will build automatically as orders arrive.</p>}</section></div>
 </div>;
}
function Metric({icon:Icon,label,value}){return <div className="metric-card"><div className="metric-icon"><Icon size={19}/></div><span>{label}</span><b>{value}</b></div>}