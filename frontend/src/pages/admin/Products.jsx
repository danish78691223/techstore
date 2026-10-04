import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { assetUrl } from "../../services/api";
export default function Products() {
  const [ps, setPs] = useState([]);
  const load = () => api.get("/products").then((r) => setPs(r.data));
  useEffect(() => {
    load();
  }, []);
  const del = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete("/products/" + id);
    load();
  };
  return (
    <>
      <div className="section-head">
        <h1>Manage Products</h1>
        <Link className="primary small" to="/admin/products/add">
          + Add New
        </Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ps.map((p) => (
              <tr key={p._id}>
                <td>
                  <img className="table-img" src={assetUrl(p.image_name)} />
                </td>
                <td>{p.name}</td>
                <td>Rs {p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button className="danger" onClick={() => del(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
