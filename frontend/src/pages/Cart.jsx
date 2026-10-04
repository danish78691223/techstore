import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { assetUrl } from "../services/api";
export default function Cart() {
  const { items, remove, update, total } = useCart();
  const nav = useNavigate();
  if (!items.length)
    return (
      <main className="container page empty">
        <h1>Your Cart is Empty</h1>
        <p>Add some tech before checking out.</p>
        <Link className="hero-btn" to="/products">
          Browse Products
        </Link>
      </main>
    );
  return (
    <main className="container page">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <section>
          {items.map((i) => (
            <div className="cart-item" key={i.product}>
              <img src={assetUrl(i.image_name)} />
              <div className="cart-main">
                <h3>{i.name}</h3>
                <strong>Rs {i.price.toLocaleString("en-IN")}</strong>
                <div className="qty">
                  <button onClick={() => update(i.product, i.quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span>{i.quantity}</span>
                  <button onClick={() => update(i.product, i.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <button className="icon-danger" onClick={() => remove(i.product)}>
                <Trash2 />
              </button>
            </div>
          ))}
        </section>
        <aside className="summary">
          <h2>Order Summary</h2>
          <div>
            <span>Subtotal</span>
            <strong>Rs {total.toLocaleString("en-IN")}</strong>
          </div>
          <div>
            <span>Shipping</span>
            <strong>Free</strong>
          </div>
          <hr />
          <div className="total">
            <span>Total</span>
            <strong>Rs {total.toLocaleString("en-IN")}</strong>
          </div>
          <button className="primary" onClick={() => nav("/checkout")}>
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </main>
  );
}
