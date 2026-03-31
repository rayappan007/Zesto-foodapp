import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Flame, Star, Clock, ChevronRight, Zap } from "lucide-react";
import { foodItems, categories } from "../data/foodData";
import FoodCard from "../components/FoodCard";

const offers = [
  { title: "50% OFF First Order", sub: "Use code WELCOME20", color: "#FF4500", emoji: "🎉" },
  { title: "Free Delivery", sub: "Orders above ₹299", color: "#9b59b6", emoji: "🚀" },
  { title: "Weekend Special", sub: "Flat ₹100 off", color: "#2ecc71", emoji: "🍕" },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/menu?q=${encodeURIComponent(search.trim())}`);
  };

  const popular = [...foodItems].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const trending = foodItems.filter(f => f.category === "Biryani" || f.category === "Pizza").slice(0, 4);

  return (
    <div className="page-wrapper" style={{ paddingTop: 72 }}>
      {/* Hero */}
      <section style={{
        minHeight: "88vh", display: "flex", alignItems: "center",
        background: "radial-gradient(ellipse at 60% 50%, rgba(255,69,0,0.12) 0%, transparent 60%), var(--bg)",
        position: "relative", overflow: "hidden"
      }}>
        {/* BG orbs */}
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,69,0,0.08) 0%, transparent 70%)",
          top: -200, right: -100, pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,179,71,0.06) 0%, transparent 70%)",
          bottom: -100, left: -50, pointerEvents: "none"
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,69,0,0.1)", border: "1px solid rgba(255,69,0,0.2)",
              padding: "8px 16px", borderRadius: "50px", marginBottom: "24px"
            }}>
              <Flame size={16} color="var(--primary)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>
                150+ Dishes Available
              </span>
            </div>

            <h1 style={{
              fontFamily: "Syne", fontWeight: 900,
              fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.05,
              marginBottom: 24
            }}>
              Delicious Food<br />
              <span style={{
                color: "var(--primary)",
                WebkitTextStroke: "0px",
                textShadow: "0 0 40px rgba(255,69,0,0.4)"
              }}>Delivered Fast</span>
            </h1>

            <p style={{ fontSize: 18, color: "var(--text-muted)", marginBottom: 40, lineHeight: 1.6, maxWidth: 480 }}>
              From sizzling biryanis to crispy pizzas — your favourite food, delivered to your door in 30 minutes.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} style={{
              display: "flex", gap: "12px", marginBottom: 40,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "50px", padding: "8px 8px 8px 20px",
              maxWidth: 520
            }}>
              <Search size={20} color="var(--text-muted)" style={{ flexShrink: 0, alignSelf: "center" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for pizza, biryani, momos..."
                style={{
                  background: "none", border: "none", flex: 1, fontSize: 15,
                  padding: "8px 0", color: "var(--text)"
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: "50px" }}>
                Search
              </button>
            </form>

            {/* Stats */}
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
              {[
                { icon: <Flame size={18} />, val: "150+", label: "Menu items" },
                { icon: <Star size={18} />, val: "4.8★", label: "Avg rating" },
                { icon: <Clock size={18} />, val: "30 min", label: "Delivery time" },
              ].map(s => (
                <div key={s.val} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "10px",
                    background: "rgba(255,69,0,0.1)", display: "flex",
                    alignItems: "center", justifyContent: "center", color: "var(--primary)"
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18 }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero food image cluster */}
        <div style={{
          position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px",
          width: 420, pointerEvents: "none"
        }} className="hero-imgs">
          {popular.slice(0, 4).map((item, i) => (
            <div key={item.food_id} style={{
              borderRadius: "20px", overflow: "hidden",
              height: i % 2 === 0 ? 200 : 160,
              alignSelf: i % 2 === 0 ? "end" : "start",
              border: "2px solid var(--border)",
              animation: `fadeUp 0.6s ${i * 0.1}s ease both`
            }}>
              <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 900px) { .hero-imgs { display: none !important; } }
        `}</style>
      </section>

      {/* Offers Banner */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            {offers.map(o => (
              <div key={o.title} style={{
                background: `linear-gradient(135deg, ${o.color}22, ${o.color}11)`,
                border: `1px solid ${o.color}33`,
                borderRadius: "20px", padding: "24px",
                display: "flex", alignItems: "center", gap: "16px",
                cursor: "pointer", transition: "transform 0.2s"
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >
                <span style={{ fontSize: 40 }}>{o.emoji}</span>
                <div>
                  <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{o.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{o.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "0 0 48px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 className="section-title">Browse by Category</h2>
            </div>
            <Link to="/menu" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: 600, fontSize: 14 }}>
              See all <ChevronRight size={16} />
            </Link>
          </div>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
            {categories.filter(c => c.id !== "all").map(cat => (
              <Link key={cat.id} to={`/menu?cat=${cat.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                <div style={{
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  borderRadius: "16px", padding: "16px 20px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                  minWidth: 90, transition: "all 0.2s", cursor: "pointer"
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.background = "rgba(255,69,0,0.05)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--bg-card)";
                  }}
                >
                  <span style={{ fontSize: 32 }}>{cat.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Foods */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h2 className="section-title">🔥 Most Popular</h2>
            <Link to="/menu" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: 600, fontSize: 14 }}>
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <p className="section-subtitle">Highest rated dishes loved by thousands</p>
          <div className="food-grid">
            {popular.map(item => <FoodCard key={item.food_id} item={item} />)}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container">
          <div style={{
            background: "linear-gradient(135deg, var(--primary), #ff8c42)",
            borderRadius: "24px", padding: "48px",
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center", gap: "20px",
            boxShadow: "0 20px 60px rgba(255,69,0,0.3)"
          }}>
            <Zap size={40} color="white" />
            <h2 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: "clamp(24px, 4vw, 40px)", color: "white" }}>
              Hungry? Order in 30 seconds.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, maxWidth: 400 }}>
              Browse 150+ dishes and get them delivered hot to your door.
            </p>
            <Link to="/menu" className="btn" style={{
              background: "white", color: "var(--primary)", padding: "14px 32px", fontSize: 16
            }}>
              Explore Full Menu <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)", padding: "40px 0",
        color: "var(--text-muted)", fontSize: 14
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, marginBottom: 8, color: "var(--text)" }}>
              Zest<span style={{ color: "var(--primary)" }}>o</span>
            </div>
            <p>Delicious food delivered fast.</p>
          </div>
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Quick Links</div>
              {["Home", "Menu", "Orders"].map(l => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <Link to={`/${l.toLowerCase() === "home" ? "" : l.toLowerCase()}`} style={{ color: "var(--text-muted)" }}>
                    {l}
                  </Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Support</div>
              {["FAQ", "Contact Us", "Privacy Policy"].map(l => (
                <div key={l} style={{ marginBottom: 8, color: "var(--text-muted)", cursor: "pointer" }}>{l}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="container" style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)", textAlign: "center" }}>
          © 2024 Zesto Food Delivery. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
