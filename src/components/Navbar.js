import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, LogOut, Menu, X, ChefHat, Package } from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { state, dispatch, cartCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out!");
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/orders", label: "Orders" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(15,15,15,0.95)" : "rgba(15,15,15,0.8)",
      backdropFilter: "blur(20px)",
      borderBottom: scrolled ? "1px solid #2a2a2a" : "1px solid transparent",
      transition: "all 0.3s",
      height: "72px", display: "flex", alignItems: "center"
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 40, height: 40, background: "var(--primary)", borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <ChefHat size={22} color="white" />
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px" }}>
            Zest<span style={{ color: "var(--primary)" }}>o</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }} className="desktop-nav">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: "8px 16px", borderRadius: "8px", fontSize: 14, fontWeight: 500,
              color: location.pathname === l.to ? "var(--primary)" : "var(--text-muted)",
              background: location.pathname === l.to ? "rgba(255,69,0,0.1)" : "transparent",
              transition: "all 0.2s"
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link to="/cart" style={{ position: "relative", padding: "8px", display: "flex" }}>
            <ShoppingCart size={22} color={cartCount > 0 ? "var(--primary)" : "var(--text-muted)"} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          {state.user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)", display: "none" }} className="show-md">
                Hi, {state.user.name.split(" ")[0]}
              </span>
              <button onClick={logout} className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>
                <LogOut size={15} /> <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: "8px 20px", fontSize: 13 }}>
              <User size={15} /> Login
            </Link>
          )}

          {/* Hamburger */}
          <button
            style={{ background: "none", border: "none", color: "var(--text)", padding: "4px", display: "none" }}
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: "72px", left: 0, right: 0,
          background: "rgba(15,15,15,0.98)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)", padding: "16px 24px 24px",
          display: "flex", flexDirection: "column", gap: "4px"
        }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: "14px 16px", borderRadius: "10px",
              color: location.pathname === l.to ? "var(--primary)" : "var(--text)",
              background: location.pathname === l.to ? "rgba(255,69,0,0.1)" : "transparent",
              fontWeight: 600, fontSize: 16
            }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 768px) {
          .show-md { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
