import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api
      .get("/products?limit=8")
      .then((r) => setProducts(r.data))
      .catch(console.error);
  }, []);
  return (
    <>
      <header className="hero">
        <div>
          <p className="eyebrow">NEXT-GEN GADGETS</p>
          <h1>
            Future Tech,
            <br />
            <span>Today.</span>
          </h1>
          <p>Premium gadgets for the modern world.</p>
          <Link className="hero-btn" to="/products">
            Explore Products
          </Link>
        </div>
      </header>
      <main className="container">
        <div className="section-head">
          <h2>Latest Arrivals</h2>
          <Link to="/products">View all →</Link>
        </div>
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
        {!products.length && (
          <p className="empty">
            No products found. Add products from the admin dashboard.
          </p>
        )}
      </main>
    </>
  );
}
