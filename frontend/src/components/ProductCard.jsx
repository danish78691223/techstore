import { ShoppingCart, ArrowUpRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { assetUrl } from "../services/api";
import { Link } from "react-router-dom";
export default function ProductCard({product}){
 const {add}=useCart();
 return <article className="product-card"><div className="product-media"><img src={product.image_name?assetUrl(product.image_name):"https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800"} alt={product.name}/><span className="product-tag">{product.stock>0?"IN STOCK":"SOLD OUT"}</span></div><div className="product-info"><div className="product-kicker">TECH NEXUS PICK <ArrowUpRight size={13}/></div><h3>{product.name}</h3><p className="desc">{product.description||"Premium technology for the modern world."}</p><div className="product-bottom"><strong>Rs {Number(product.price).toLocaleString("en-IN")}</strong><span>{product.stock} units</span></div><button disabled={!product.stock} onClick={()=>add(product)}><ShoppingCart size={16}/>{product.stock?"Add to cart":"Out of stock"}</button></div></article>;
}