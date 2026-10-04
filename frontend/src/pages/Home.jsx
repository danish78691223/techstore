import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight,Truck,ShieldCheck,Sparkles,Headphones } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home(){
 const [products,setProducts]=useState([]);
 const {user}=useAuth();
 useEffect(()=>{api.get("/products?limit=8").then(r=>setProducts(r.data)).catch(console.error)},[]);
 return <><header className="hero"><div><p className="eyebrow">CURATED TECH • BUILT TO PERFORM</p><h1>Gear that makes<br/><span>work feel better.</span></h1><p>Discover sharp displays, fast components and everyday upgrades designed to earn a place on your desk.</p><div className="hero-actions"><Link className="hero-btn" to="/products">Shop the collection <ArrowRight size={17}/></Link>{user?<Link className="hero-secondary" to="/orders">View your orders</Link>:<Link className="hero-secondary" to="/register">Join Tech Nexus</Link>}</div></div></header>
 <section className="benefits container"><div><Truck size={20}/><span><b>Reliable delivery</b><small>Ready-to-ship essentials</small></span></div><div><ShieldCheck size={20}/><span><b>Secure checkout</b><small>Your account stays protected</small></span></div><div><Sparkles size={20}/><span><b>Curated catalog</b><small>Less noise, better picks</small></span></div><div><Headphones size={20}/><span><b>Human support</b><small>We care after checkout too</small></span></div></section>
 <main className="container home-products"><div className="section-head"><div><p className="eyebrow">JUST IN</p><h2>Latest arrivals</h2></div><Link to="/products">Explore all <ArrowRight size={16}/></Link></div><div className="product-grid">{products.map(p=><ProductCard key={p._id} product={p}/>)}</div>{!products.length&&<p className="empty">No products found. Add products from the admin dashboard.</p>}</main></>;
}