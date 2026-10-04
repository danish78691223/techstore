import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
export default function AddProduct() {
  const [form, setForm] = useState({
      name: "",
      price: "",
      stock: "",
      description: "",
    }),
    [image, setImage] = useState(null),
    [error, setError] = useState("");
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append("image", image);
    try {
      await api.post("/products", fd);
      nav("/admin/products");
    } catch (x) {
      setError(x.response?.data?.message || "Failed");
    }
  };
  return (
    <>
      <h1>Add New Product</h1>
      <form className="form-card narrow" onSubmit={submit}>
        {error && <div className="error">{error}</div>}
        <input
          required
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          type="number"
          min="0"
          placeholder="Price (Rs)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          required
          type="number"
          min="0"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button className="primary">Upload Product</button>
      </form>
    </>
  );
}
