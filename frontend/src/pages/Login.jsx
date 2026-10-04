import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" }),
    [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      nav("/");
    } catch (x) {
      setError(x.response?.data?.message || "Login failed");
    }
  };
  return (
    <AuthShell title="Welcome Back">
      <form onSubmit={submit}>
        {error && <div className="error">{error}</div>}
        <input
          type="email"
          placeholder="Email Address"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="primary">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </AuthShell>
  );
}
function AuthShell({ title, children }) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="brand big">
          TECH NEXUS<span>EST. 2012</span>
        </div>
        <h2>{title}</h2>
        {children}
      </div>
    </main>
  );
}
