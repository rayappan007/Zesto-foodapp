import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, CreditCard, Truck, Smartphone, CheckCircle, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { coupons } from "../data/foodData";
import toast from "react-hot-toast";

export default function Checkout() {
  const { state, dispatch, cartTotal } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: state.user?.name || "",
    phone: state.user?.phone || "",
    address: state.user?.address || "",
    payment: "cod"
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);

  const delivery = 40;
  const tax = Math.round(cartTotal * 0.05);

  const discount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? Math.round(cartTotal * appliedCoupon.discount / 100)
      : cartTotal >= 300 || appliedCoupon.discount === 50
        ? appliedCoupon.discount
        : 0
    : 0;

  const total = cartTotal + delivery + tax - discount;

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    if (coupons[code]) {
      setAppliedCoupon(coupons[code]);
      setCouponError("");
      toast.success(`Coupon "${code}" applied! ${coupons[code].description}`);
    } else {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code. Try: ZESTO10, SAVE50, WELCOME20, FEAST100");
    }
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill all delivery details");
      return;
    }
    if (state.cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    const orderId = "ZST" + Date.now().toString().slice(-6);
    const order = {
      order_id: orderId,
      user_id: state.user.email,
      items: state.cart,
      subtotal: cartTotal,
      delivery,
      tax,
      discount,
      total,
      delivery_address: form.address,
      phone: form.phone,
      payment: form.payment,
      status: "placed",
      order_date: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    };

    dispatch({ type: "PLACE_ORDER", payload: order });
    dispatch({ type: "CLEAR_CART" });
    setLoading(false);
    navigate(`/order-confirmation/${orderId}`);
  };

  if (state.cart.length === 0) {
    navigate("/cart");
    return null;
  }

  const paymentOptions = [
    { id: "cod", label: "Cash on Delivery", icon: <Truck size={18} />, desc: "Pay when delivered" },
    { id: "upi", label: "UPI", icon: <Smartphone size={18} />, desc: "GPay, PhonePe, Paytm" },
    { id: "card", label: "Credit/Debit Card", icon: <CreditCard size={18} />, desc: "Visa, Mastercard" },
  ];

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <h1 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: "clamp(28px, 5vw, 40px)", marginBottom: 40 }}>
          Checkout
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "40px", alignItems: "start" }}>
          {/* Left: Form */}
          <div>
            {/* Delivery Details */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "20px", padding: "28px", marginBottom: "24px"
            }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18, marginBottom: 24 }}>
                📍 Delivery Details
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 99999 99999" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Full address with landmark..."
                  rows={3}
                  style={{
                    resize: "none", width: "100%", background: "var(--bg-card2)",
                    border: "1px solid var(--border)", color: "var(--text)",
                    borderRadius: "8px", padding: "12px 16px", outline: "none"
                  }}
                />
              </div>
            </div>

            {/* Payment */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "20px", padding: "28px", marginBottom: "24px"
            }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18, marginBottom: 24 }}>
                💳 Payment Method
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {paymentOptions.map(opt => (
                  <label key={opt.id} style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "16px", borderRadius: "12px", cursor: "pointer",
                    border: `2px solid ${form.payment === opt.id ? "var(--primary)" : "var(--border)"}`,
                    background: form.payment === opt.id ? "rgba(255,69,0,0.05)" : "transparent",
                    transition: "all 0.2s"
                  }}>
                    <input
                      type="radio" name="payment" value={opt.id}
                      checked={form.payment === opt.id}
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                    <div style={{
                      width: 40, height: 40, borderRadius: "10px",
                      background: form.payment === opt.id ? "rgba(255,69,0,0.15)" : "var(--bg-card2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: form.payment === opt.id ? "var(--primary)" : "var(--text-muted)"
                    }}>
                      {opt.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{opt.label}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{opt.desc}</div>
                    </div>
                    {form.payment === opt.id && <CheckCircle size={20} color="var(--primary)" />}
                  </label>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "20px", padding: "28px"
            }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18, marginBottom: 20 }}>
                🏷️ Coupon Code
              </h3>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "0 16px" }}>
                  <Tag size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <input
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code..."
                    style={{ border: "none", background: "none", padding: "12px", flex: 1 }}
                    onKeyDown={e => e.key === "Enter" && applyCoupon()}
                  />
                </div>
                <button onClick={applyCoupon} className="btn btn-outline" style={{ borderRadius: "10px", padding: "12px 20px" }}>
                  Apply
                </button>
              </div>
              {couponError && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: 12, color: "#ff5555", fontSize: 13 }}>
                  <AlertCircle size={14} /> {couponError}
                </div>
              )}
              {appliedCoupon && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: 12, color: "var(--accent)", fontSize: 13 }}>
                  <CheckCircle size={14} /> {appliedCoupon.description} — saving ₹{discount}!
                </div>
              )}
              <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,69,0,0.05)", borderRadius: "10px", border: "1px dashed rgba(255,69,0,0.2)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Available coupons:</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {Object.keys(coupons).map(c => (
                    <span key={c} onClick={() => { setCouponCode(c); }}
                      style={{
                        padding: "4px 12px", background: "rgba(255,69,0,0.1)",
                        color: "var(--primary)", borderRadius: "50px", fontSize: 12,
                        fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,69,0,0.2)"
                      }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "20px", padding: "28px", position: "sticky", top: "96px"
          }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Order Summary</h3>
            
            {/* Items */}
            <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 20 }}>
              {state.cart.map(item => (
                <div key={item.food_id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: "var(--text-muted)" }}>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              {[
                { label: "Subtotal", val: `₹${cartTotal}` },
                { label: "Delivery", val: `₹${delivery}` },
                { label: "Tax (5%)", val: `₹${tax}` },
                ...(discount > 0 ? [{ label: "Discount", val: `-₹${discount}`, color: "var(--accent)" }] : []),
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: "var(--text-muted)" }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: r.color || "var(--text)" }}>{r.val}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", marginTop: 8, paddingTop: 16, display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18 }}>Total</span>
              <span style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 26, color: "var(--primary)" }}>₹{total}</span>
            </div>

            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20, display: "flex", alignItems: "center", gap: "6px" }}>
              ⏱️ Estimated delivery: <strong style={{ color: "var(--text)" }}>25–35 minutes</strong>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "18px", fontSize: 16, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <><span className="loading-spinner" style={{ width: 20, height: 20, margin: 0 }} /> Placing Order...</>
              ) : (
                `Place Order • ₹${total}`
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
