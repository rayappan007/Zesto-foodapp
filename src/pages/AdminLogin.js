import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    if (form.email === "admin@zesto.com" && form.password === "admin123") {
      dispatch({ type: "ADMIN_LOGIN" });
      toast.success("Welcome, Admin!");
      navigate("/admin");
    } else {
      toast.error("Invalid admin credentials");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 50% 0%, rgba(155,89,182,0.1) 0%, transparent 60%), var(--bg)",
      padding: "24px"
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #9b59b6, #6c3483)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Shield size={32} color="white" />
          </div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Admin Panel</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Zesto Restaurant Management</p>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "24px", padding: "32px" }}>
          <form onSubmit={login}>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input name="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@zesto.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input name="password" type={show ? "text" : "password"} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShow(!show)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ background: "rgba(155,89,182,0.05)", border: "1px dashed rgba(155,89,182,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "var(--text-muted)" }}>
              Demo: admin@zesto.com / admin123
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "16px", background: "linear-gradient(135deg, #9b59b6, #6c3483)",
              color: "white", border: "none", borderRadius: "12px", fontSize: 16, fontWeight: 700, cursor: "pointer",
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? "Signing in..." : "Admin Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link to="/login" style={{ color: "var(--text-muted)", fontSize: 14 }}>← User Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
