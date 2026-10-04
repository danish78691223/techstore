import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
export default function Products(){
 const [products,setProducts]=useState([]),[search,setSearch]=useState("");
 useEffect(()=>{const t=setTimeout(()=>api.get("/products"+(search?"?search="+encodeURIComponent(search):"")).then(r=>setProducts(r.data)).catch(console.error),220);return()=>clearTimeout(t)},[search]);
 return <main className="container page products-page"><section className="catalog-hero"><div><p className="eyebrow">THE COLLECTION</p><h1>Shop better tech.</h1><p>High-signal hardware for desks, studios and gaming rigs.</p></div><div className="catalog-stat"><Sparkles size={16}/><span>Fresh picks<br/><b>{products.length} products</b></span></div></section><div className="catalog-toolbar"><div className="search-wrap"><Search size={18}/><input className="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search monitors, keyboards, GPUs..."/></div><button className="filter-button"><SlidersHorizontal size={17}/>Curated for you</button></div><div className="product-grid">{products.map(p=><ProductCard key={p._id} product={p}/>)}</div>{!products.length&&<p className="empty">No products match your search.</p>}</main>;
}