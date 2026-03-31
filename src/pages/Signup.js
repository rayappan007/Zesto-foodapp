import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ChefHat } from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

export default function Signup() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const signup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords don't match!"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const existing = JSON.parse(localStorage.getItem("zesto_users") || "[]");
    if (existing.find(u => u.email === form.email)) {
      toast.error("Email already registered!");
      setLoading(false);
      return;
    }

    const newUser = { name: form.name, email: form.email, phone: form.phone, address: form.address, password: form.password };
    localStorage.setItem("zesto_users", JSON.stringify([...existing, newUser]));
    dispatch({ type: "LOGIN", payload: newUser });
    toast.success(`Welcome to Zesto, ${form.name.split(" ")[0]}! 🎉`);
    navigate("/");
    setLoading(false);
  };

  const fields = [
    { name: "name", type: "text", label: "Full Name", placeholder: "John Doe", Icon: User },
    { name: "email", type: "email", label: "Email", placeholder: "you@example.com", Icon: Mail },
    { name: "phone", type: "tel", label: "Phone", placeholder: "+91 99999 99999", Icon: Phone },
    { name: "address", type: "text", label: "Address", placeholder: "Your delivery address", Icon: MapPin },
  ];

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 50% 0%, rgba(255,69,0,0.1) 0%, transparent 60%), var(--bg)",
      padding: "24px"
    }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 64, height: 64, background: "var(--primary)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChefHat size={32} color="white" />
            </div>
            <span style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 28 }}>Zest<span style={{ color: "var(--primary)" }}>o</span></span>
          </Link>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 24, marginTop: 16, marginBottom: 8 }}>Create account</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Join and start ordering delicious food</p>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "24px", padding: "32px" }}>
          <form onSubmit={signup}>
            {fields.map(f => (
              <div key={f.name} className="form-group">
                <label className="form-label">{f.label}</label>
                <div style={{ position: "relative" }}>
                  <f.Icon size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                  <input name={f.name} type={f.type} value={form[f.name]} onChange={handleChange}
                    placeholder={f.placeholder} required style={{ paddingLeft: 40 }} />
                </div>
              </div>
            ))}

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input name="password" type={show ? "text" : "password"} value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" required style={{ paddingLeft: 40, paddingRight: 44 }} />
                <button type="button" onClick={() => setShow(!show)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange}
                  placeholder="Repeat password" required style={{ paddingLeft: 40 }} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: 16, marginTop: 8 }}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24, color: "var(--text-muted)", fontSize: 14 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
