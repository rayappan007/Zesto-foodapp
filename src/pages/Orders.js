import React from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { useApp } from "../context/AppContext";

const statusLabels = {
  placed: { label: "Order Placed", class: "status-placed" },
  preparing: { label: "Preparing", class: "status-preparing" },
  delivery: { label: "Out for Delivery", class: "status-delivery" },
  delivered: { label: "Delivered", class: "status-delivered" },
};

export default function Orders() {
  const { state } = useApp();
  const orders = state.orders.filter(o => o.user_id === state.user?.email);

  if (orders.length === 0) return (
    <div className="page-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", gap: 24 }}>
      <div style={{ fontSize: 80 }}>📦</div>
      <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 28 }}>No orders yet</h2>
      <p style={{ color: "var(--text-muted)" }}>Your order history will appear here</p>
      <Link to="/menu" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>
        <ShoppingBag size={18} /> Start Ordering
      </Link>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div className="page-header" style={{ textAlign: "left", paddingBottom: 32 }}>
          <h1>My <span style={{ color: "var(--primary)" }}>Orders</span></h1>
          <p style={{ color: "var(--text-muted)" }}>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map(order => {
            const st = statusLabels[order.status] || statusLabels.placed;
            return (
              <div key={order.order_id} style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "20px", padding: "24px", transition: "border-color 0.2s"
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,69,0,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                {/* Order header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: 4 }}>
                      <Package size={18} color="var(--primary)" />
                      <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18 }}>#{order.order_id}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {new Date(order.order_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span className={`status ${st.class}`}>{st.label}</span>
                    <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, color: "var(--primary)" }}>₹{order.total}</div>
                  </div>
                </div>

                {/* Items */}
                <div style={{
                  display: "flex", gap: "12px", marginBottom: 16, flexWrap: "wrap"
                }}>
                  {order.items.slice(0, 4).map(item => (
                    <div key={item.food_id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <img src={item.image} alt={item.name}
                        style={{ width: 40, height: 40, borderRadius: "8px", objectFit: "cover" }}
                        onError={e => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&q=80"; }}
                      />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>×{item.quantity}</div>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div style={{ display: "flex", alignItems: "center", color: "var(--text-muted)", fontSize: 13 }}>
                      +{order.items.length - 4} more
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 16, flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {order.items.reduce((s, i) => s + i.quantity, 0)} items · {order.payment === "cod" ? "Cash on Delivery" : order.payment.toUpperCase()}
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <Link to={`/track/${order.order_id}`} className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>
                      Track <ChevronRight size={14} />
                    </Link>
                    <Link to="/menu" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
                      Reorder
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
