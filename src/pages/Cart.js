import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

export default function Cart() {
  const { state, dispatch, cartTotal } = useApp();
  const navigate = useNavigate();
  const delivery = cartTotal > 0 ? 40 : 0;

  const update = (food_id, quantity) => {
    if (quantity < 1) {
      dispatch({ type: "REMOVE_FROM_CART", payload: food_id });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { food_id, quantity } });
    }
  };

  const remove = (food_id, name) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: food_id });
    toast.success(`${name} removed`);
  };

  if (state.cart.length === 0) return (
    <div className="page-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", gap: 24 }}>
      <div style={{ fontSize: 80 }}>🛒</div>
      <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 28 }}>Your cart is empty</h2>
      <p style={{ color: "var(--text-muted)" }}>Add some delicious food to get started!</p>
      <Link to="/menu" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>
        <ShoppingBag size={18} /> Browse Menu
      </Link>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <h1 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: "clamp(28px, 5vw, 40px)", marginBottom: 32 }}>
          Your Cart <span style={{ color: "var(--text-muted)", fontSize: "0.6em" }}>({state.cart.length} items)</span>
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>
          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {state.cart.map(item => (
              <div key={item.food_id} style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "16px", padding: "16px", display: "flex", gap: "16px", alignItems: "center"
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 90, height: 90, borderRadius: "12px", objectFit: "cover", flexShrink: 0 }}
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"; }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{item.category}</div>
                  <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                  <div style={{ fontFamily: "Syne", fontWeight: 800, color: "var(--primary)", fontSize: 18 }}>₹{item.price * item.quantity}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={() => update(item.food_id, item.quantity - 1)}
                    style={{
                      width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)",
                      background: "var(--bg-card2)", color: "var(--text)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 16, width: 28, textAlign: "center" }}>{item.quantity}</span>
                  <button
                    onClick={() => update(item.food_id, item.quantity + 1)}
                    style={{
                      width: 32, height: 32, borderRadius: "50%", border: "none",
                      background: "var(--primary)", color: "white", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => remove(item.food_id, item.name)}
                    style={{
                      width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,50,50,0.3)",
                      background: "rgba(255,50,50,0.1)", color: "#ff5555", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 8
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "20px", padding: "24px", position: "sticky", top: "96px"
          }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Order Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: 20 }}>
              {[
                { label: "Subtotal", val: `₹${cartTotal}` },
                { label: "Delivery Fee", val: `₹${delivery}` },
                { label: "Taxes", val: `₹${Math.round(cartTotal * 0.05)}` },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-muted)" }}>
                  <span>{r.label}</span>
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>{r.val}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18 }}>Total</span>
                <span style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 24, color: "var(--primary)" }}>
                  ₹{cartTotal + delivery + Math.round(cartTotal * 0.05)}
                </span>
              </div>
            </div>
            <button onClick={() => navigate("/checkout")} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: 16 }}>
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <Link to="/menu" style={{
              display: "block", textAlign: "center", marginTop: 16,
              color: "var(--text-muted)", fontSize: 14
            }}>
              + Add more items
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
