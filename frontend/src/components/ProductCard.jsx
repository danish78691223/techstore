import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { assetUrl } from "../services/api";
export default function ProductCard({ product }) {
  const { add } = useCart();
  return (
    <article className="product-card">
      <img
        src={
          product.image_name
            ? assetUrl(product.image_name)
            : "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800"
        }
      />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="desc">
          {product.description || "Premium technology for the modern world."}
        </p>
        <div className="product-bottom">
          <strong>Rs {Number(product.price).toLocaleString("en-IN")}</strong>
          <span>{product.stock} in stock</span>
        </div>
        <button disabled={!product.stock} onClick={() => add(product)}>
          <ShoppingCart size={16} />
          {product.stock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
