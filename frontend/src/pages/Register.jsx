import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Register() {
  const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    }),
    [error, setError] = useState("");
  const { register } = useAuth();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      nav("/");
    } catch (x) {
      setError(x.response?.data?.message || "Registration failed");
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="brand big">
          TECH NEXUS<span>EST. 2012</span>
        </div>
        <h2>Create Account</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <input
            placeholder="Full Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={form.confirm_password}
            onChange={(e) =>
              setForm({ ...form, confirm_password: e.target.value })
            }
          />
          <button className="primary">Create Account</button>
        </form>
        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
