import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});
api.interceptors.request.use((c) => {
  const t = localStorage.getItem("tech_token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
export default api;
export const assetUrl = (name) =>
  name?.startsWith("http")
    ? name
    : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "")}/${name?.startsWith("uploads/") ? name : `uploads/${encodeURIComponent(name || "")}`}`;
