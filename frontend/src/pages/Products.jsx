import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
export default function Products() {
  const [products, setProducts] = useState([]),
    [search, setSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(
      () =>
        api
          .get(
            `/products${search ? `?search=${encodeURIComponent(search)}` : ""}`,
          )
          .then((r) => setProducts(r.data)),
      250,
    );
    return () => clearTimeout(t);
  }, [search]);
  return (
    <main className="container page">
      <div className="section-head">
        <div>
          <p className="eyebrow">TECH NEXUS CATALOG</p>
          <h1>All Products</h1>
        </div>
        <input
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search gadgets..."
        />
      </div>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </main>
  );
}
