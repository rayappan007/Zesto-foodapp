import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Package, Clock, MapPin, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function OrderConfirmation() {
  const { id } = useParams();
  const { state } = useApp();
  const navigate = useNavigate();

  const order = state.orders.find(o => o.order_id === id);

  if (!order) return (
    <div className="page-wrapper" style={{ textAlign: "center", paddingTop: 160 }}>
      <h2>Order not found</h2>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>Go Home</Link>
    </div>
  );

  const deliveryTime = new Date(order.estimated_delivery).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64, maxWidth: 700 }}>
        {/* Success Banner */}
        <div style={{
          textAlign: "center", marginBottom: 48,
          animation: "fadeUp 0.5s ease"
        }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: "rgba(46,204,113,0.15)", border: "3px solid var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px"
          }}>
            <CheckCircle size={48} color="var(--accent)" />
          </div>
          <h1 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: "clamp(28px, 5vw, 44px)", marginBottom: 12 }}>
            Order Placed! 🎉
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 16 }}>
            Your food is being prepared and will be delivered soon.
          </p>
        </div>

        {/* Order ID Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,69,0,0.15), rgba(255,179,71,0.05))",
          border: "1px solid rgba(255,69,0,0.3)",
          borderRadius: "20px", padding: "24px", marginBottom: "24px",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16
        }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Order ID</div>
            <div style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 24, color: "var(--primary)" }}>#{order.order_id}</div>
          </div>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Date</div>
              <div style={{ fontWeight: 700 }}>{new Date(order.order_date).toLocaleDateString()}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Items</div>
              <div style={{ fontWeight: 700 }}>{order.items.length}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Total</div>
              <div style={{ fontFamily: "Syne", fontWeight: 800, color: "var(--primary)" }}>₹{order.total}</div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: 12 }}>
              <Clock size={18} color="var(--primary)" />
              <span style={{ fontWeight: 700 }}>Estimated Delivery</span>
            </div>
            <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 22 }}>{deliveryTime}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>25–35 minutes</div>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: 12 }}>
              <MapPin size={18} color="var(--primary)" />
              <span style={{ fontWeight: 700 }}>Delivery Address</span>
            </div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>{order.delivery_address}</div>
          </div>
        </div>

        {/* Order Items */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18, marginBottom: 20 }}>
            <Package size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
            Order Items
          </h3>
          {order.items.map(item => (
            <div key={item.food_id} style={{
              display: "flex", alignItems: "center", gap: "16px",
              paddingBottom: "16px", marginBottom: "16px",
              borderBottom: "1px solid var(--border)"
            }}>
              <img src={item.image} alt={item.name} style={{ width: 56, height: 56, borderRadius: "10px", objectFit: "cover" }}
                onError={e => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80"; }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontFamily: "Syne", fontWeight: 800, color: "var(--primary)" }}>₹{item.price * item.quantity}</div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Syne", fontWeight: 900, fontSize: 18 }}>
            <span>Total Paid</span>
            <span style={{ color: "var(--primary)" }}>₹{order.total}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link to={`/track/${order.order_id}`} className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: "16px" }}>
            Track Order <ArrowRight size={18} />
          </Link>
          <Link to="/menu" className="btn btn-outline" style={{ flex: 1, justifyContent: "center", padding: "16px" }}>
            Order Again
          </Link>
        </div>
      </div>
    </div>
  );
}
