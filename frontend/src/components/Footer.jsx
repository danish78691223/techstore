import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram, Github, Linkedin, ShieldCheck } from "lucide-react";
export default function Footer(){
  return <footer className="industrial-footer"><div className="footer-grid">
    <div className="footer-brand"><div className="footer-logo"><span className="brand-mark">TN</span><strong>TECH NEXUS</strong></div><p>Premium technology, curated for builders, creators and everyday power users.</p><div className="footer-socials"><a href="#" aria-label="Instagram"><Instagram size={17}/></a><a href="#" aria-label="Github"><Github size={17}/></a><a href="#" aria-label="LinkedIn"><Linkedin size={17}/></a></div></div>
    <div><h4>Explore</h4><Link to="/products">Shop all products</Link><Link to="/cart">Your cart</Link><Link to="/orders">My orders</Link></div>
    <div><h4>Standards</h4><span>Curated tech</span><span>Fast support</span><span>Secure checkout</span><span>Quality first</span></div>
    <div className="footer-cta"><div className="security-chip"><ShieldCheck size={17}/>Trusted storefront</div><h3>Upgrade your setup.</h3><Link to="/products">Start shopping <ArrowUpRight size={17}/></Link></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} Tech Nexus</span><span>Built for modern commerce.</span></div></footer>;
}