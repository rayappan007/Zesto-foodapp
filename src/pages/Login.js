import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ChefHat } from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

// Demo accounts
const DEMO_USERS = [
  { email: "demo@zesto.com", password: "demo123", name: "Demo User", phone: "+91 98765 43210", address: "42, MG Road, Bangalore" },
  { email: "test@user.com", password: "test123", name: "Test User", phone: "+91 91234 56789", address: "10, Anna Nagar, Chennai" },
];

export default function Login() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    // Check registered users in localStorage
    const registered = JSON.parse(localStorage.getItem("zesto_users") || "[]");
    const all = [...DEMO_USERS, ...registered];
    const user = all.find(u => u.email === form.email && u.password === form.password);

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
      toast.success(`Welcome back, ${user.name.split(" ")[0]}! 🎉`);
      navigate("/");
    } else {
      toast.error("Invalid email or password");
    }
    setLoading(false);
  };

  const quickLogin = () => {
    setForm({ email: "demo@zesto.com", password: "demo123" });
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 50% 0%, rgba(255,69,0,0.1) 0%, transparent 60%), var(--bg)",
      padding: "24px"
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link to="/" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 64, height: 64, background: "var(--primary)", borderRadius: "20px",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <ChefHat size={32} color="white" />
            </div>
            <span style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 28 }}>
              Zest<span style={{ color: "var(--primary)" }}>o</span>
            </span>
          </Link>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 24, marginTop: 16, marginBottom: 8 }}>Welcome back</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Sign in to continue ordering</p>
        </div>

        {/* Card */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "24px", padding: "32px" }}>
          <form onSubmit={login}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input name="password" type={show ? "text" : "password"} value={form.password} onChange={handleChange}
                  placeholder="••••••••" required style={{ paddingLeft: 40, paddingRight: 44 }} />
                <button type="button" onClick={() => setShow(!show)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: 16, marginTop: 8 }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo */}
          <div style={{ marginTop: 16, padding: "14px", background: "rgba(255,69,0,0.05)", border: "1px dashed rgba(255,69,0,0.2)", borderRadius: "12px" }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>🎯 Quick demo access:</div>
            <button onClick={quickLogin} style={{
              background: "none", border: "none", color: "var(--primary)", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0
            }}>
              demo@zesto.com / demo123
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 24, color: "var(--text-muted)", fontSize: 14 }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "var(--primary)", fontWeight: 700 }}>Sign up</Link>
          </div>
        </div>

        {/* Admin link */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to="/admin/login" style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Admin Panel →
          </Link>
        </div>
      </div>
    </div>
  );
}
