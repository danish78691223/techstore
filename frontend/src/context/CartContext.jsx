import { createContext, useContext, useEffect, useMemo, useState } from "react";
const C = createContext();
export function CartProvider({ children }) {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem("tech_cart") || "[]"),
  );
  useEffect(
    () => localStorage.setItem("tech_cart", JSON.stringify(items)),
    [items],
  );
  const add = (p) =>
    setItems((a) => {
      const x = a.find((i) => i.product === p._id);
      if (x)
        return a.map((i) =>
          i.product === p._id
            ? { ...i, quantity: Math.min(i.quantity + 1, p.stock) }
            : i,
        );
      return [
        ...a,
        {
          product: p._id,
          name: p.name,
          price: p.price,
          image_name: p.image_name,
          quantity: 1,
        },
      ];
    });
  const remove = (id) => setItems((a) => a.filter((i) => i.product !== id));
  const update = (id, q) =>
    setItems((a) =>
      a.map((i) =>
        i.product === id ? { ...i, quantity: Math.max(1, Number(q) || 1) } : i,
      ),
    );
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.quantity, 0),
    total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return (
    <C.Provider value={{ items, add, remove, update, clear, count, total }}>
      {children}
    </C.Provider>
  );
}
export const useCart = () => useContext(C);
