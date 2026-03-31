import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, Plus, Minus, ShoppingCart, ArrowLeft, Flame } from "lucide-react";
import { foodItems } from "../data/foodData";
import { useApp } from "../context/AppContext";
import FoodCard from "../components/FoodCard";
import toast from "react-hot-toast";

export default function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [qty, setQty] = useState(1);

  const item = foodItems.find(f => f.food_id === parseInt(id));
  if (!item) return (
    <div className="page-wrapper" style={{ textAlign: "center", paddingTop: 160 }}>
      <h2>Item not found</h2>
      <Link to="/menu" className="btn btn-primary" style={{ marginTop: 24 }}>Back to Menu</Link>
    </div>
  );

  const inCart = state.cart.find(c => c.food_id === item.food_id);
  const related = foodItems.filter(f => f.category === item.category && f.food_id !== item.food_id).slice(0, 4);

  const addToCart = () => {
    if (!state.user) { toast.error("Please login first!"); navigate("/login"); return; }
    for (let i = 0; i < qty; i++) {
      dispatch({ type: "ADD_TO_CART", payload: item });
    }
    toast.success(`${qty}x ${item.name} added to cart!`);
  };

  const fullStars = Math.floor(item.rating);
  const hasHalf = item.rating % 1 >= 0.5;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: 32, padding: "8px 16px" }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>
          {/* Image */}
          <div style={{ borderRadius: "24px", overflow: "hidden", position: "relative" }}>
            <img
              src={item.image}
              alt={item.name}
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
              onError={e => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80"; }}
            />
            <div style={{
              position: "absolute", top: 16, left: 16,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
              padding: "6px 14px", borderRadius: "50px"
            }}>
              <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: 13 }}>{item.category}</span>
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: "clamp(24px, 3vw, 40px)", marginBottom: 12, lineHeight: 1.2 }}>
              {item.name}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} size={18}
                    fill={n <= fullStars ? "#FFB347" : n === fullStars + 1 && hasHalf ? "#FFB347" : "none"}
                    color="#FFB347"
                    opacity={n > fullStars + 1 ? 0.3 : 1}
                  />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{item.rating}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 14 }}>out of 5</span>
            </div>

            <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: 16, marginBottom: 28 }}>
              {item.description}
            </p>

            {/* Price */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Price</div>
              <div style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 40, color: "var(--primary)" }}>
                ₹{item.price * qty}
              </div>
              {qty > 1 && <div style={{ fontSize: 13, color: "var(--text-muted)" }}>₹{item.price} × {qty}</div>}
            </div>

            {/* Qty selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: 28 }}>
              <div style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Quantity</div>
              <div style={{
                display: "flex", alignItems: "center", gap: "4px",
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "50px", padding: "4px"
              }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{
                    width: 36, height: 36, borderRadius: "50%", border: "none",
                    background: qty === 1 ? "transparent" : "var(--bg-card2)",
                    color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18, width: 32, textAlign: "center" }}>{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  style={{
                    width: 36, height: 36, borderRadius: "50%", border: "none",
                    background: "var(--primary)", color: "white", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={addToCart} className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: "16px 24px", fontSize: 16 }}>
                <ShoppingCart size={20} />
                {inCart ? `Add More (${inCart.quantity} in cart)` : "Add to Cart"}
              </button>
              <button onClick={() => { addToCart(); navigate("/cart"); }} className="btn btn-outline" style={{ padding: "16px 24px" }}>
                Buy Now
              </button>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: "8px", marginTop: 24, flexWrap: "wrap" }}>
              <span className="tag"><Flame size={12} /> Hot Favourite</span>
              <span className="tag">⚡ 30 min delivery</span>
              <span className="tag">🛡️ Hygiene certified</span>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 className="section-title" style={{ marginBottom: 8 }}>More from {item.category}</h2>
            <p className="section-subtitle">You might also like these</p>
            <div className="food-grid">
              {related.map(r => <FoodCard key={r.food_id} item={r} />)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
