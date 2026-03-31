import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Circle, Package, Flame, Bike, Home } from "lucide-react";
import { useApp } from "../context/AppContext";

const stages = [
  { key: "placed", label: "Order Placed", icon: <Package size={24} />, desc: "We received your order" },
  { key: "preparing", label: "Preparing Food", icon: <Flame size={24} />, desc: "Chef is cooking your meal" },
  { key: "delivery", label: "Out for Delivery", icon: <Bike size={24} />, desc: "On the way to you!" },
  { key: "delivered", label: "Delivered", icon: <Home size={24} />, desc: "Enjoy your meal! 🎉" },
];

const stageIndex = { placed: 0, preparing: 1, delivery: 2, delivered: 3 };

export default function OrderTracking() {
  const { id } = useParams();
  const { state, dispatch } = useApp();
  const [current, setCurrent] = useState(0);

  const order = state.orders.find(o => o.order_id === id);

  useEffect(() => {
    if (!order) return;
    setCurrent(stageIndex[order.status] ?? 0);

    // Auto-advance simulation
    if (order.status === "placed") {
      const t1 = setTimeout(() => {
        dispatch({ type: "UPDATE_ORDER_STATUS", payload: { order_id: id, status: "preparing" } });
        setCurrent(1);
      }, 5000);
      const t2 = setTimeout(() => {
        dispatch({ type: "UPDATE_ORDER_STATUS", payload: { order_id: id, status: "delivery" } });
        setCurrent(2);
      }, 12000);
      const t3 = setTimeout(() => {
        dispatch({ type: "UPDATE_ORDER_STATUS", payload: { order_id: id, status: "delivered" } });
        setCurrent(3);
      }, 20000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [order?.status]);

  if (!order) return (
    <div className="page-wrapper" style={{ textAlign: "center", paddingTop: 160 }}>
      <h2>Order not found</h2>
      <Link to="/orders" className="btn btn-primary" style={{ marginTop: 24 }}>My Orders</Link>
    </div>
  );

  const deliveryTime = new Date(order.estimated_delivery).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64, maxWidth: 600 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: "clamp(28px, 5vw, 40px)", marginBottom: 8 }}>
            Tracking Order
          </h1>
          <div style={{ color: "var(--primary)", fontWeight: 700, fontSize: 18 }}>#{order.order_id}</div>
        </div>

        {/* ETA */}
        <div style={{
          background: current === 3 ? "rgba(46,204,113,0.1)" : "rgba(255,69,0,0.08)",
          border: `1px solid ${current === 3 ? "rgba(46,204,113,0.3)" : "rgba(255,69,0,0.2)"}`,
          borderRadius: "16px", padding: "20px 24px", marginBottom: "40px",
          textAlign: "center"
        }}>
          {current === 3 ? (
            <div>
              <CheckCircle size={32} color="var(--accent)" style={{ marginBottom: 8 }} />
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, color: "var(--accent)" }}>Delivered! Enjoy your meal 🎉</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 4 }}>Estimated arrival</div>
              <div style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 36, color: "var(--primary)" }}>{deliveryTime}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Approx. 25–35 minutes</div>
            </div>
          )}
        </div>

        {/* Progress Tracker */}
        <div style={{ position: "relative", padding: "0 24px" }}>
          {/* Line */}
          <div style={{
            position: "absolute", left: "50%", top: 32, bottom: 32,
            width: 2, background: "var(--border)", transform: "translateX(-50%)", zIndex: 0
          }} />
          <div style={{
            position: "absolute", left: "50%", top: 32, width: 2,
            background: "var(--primary)", transform: "translateX(-50%)", zIndex: 1,
            height: `${(current / (stages.length - 1)) * (100 - 0)}%`,
            transition: "height 0.8s ease"
          }} />

          {stages.map((stage, i) => {
            const done = i <= current;
            const active = i === current;
            return (
              <div key={stage.key} style={{
                display: "flex", alignItems: "center", gap: "20px",
                marginBottom: i < stages.length - 1 ? "40px" : 0,
                position: "relative", zIndex: 2
              }}>
                {/* Icon */}
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                  background: done ? (active ? "var(--primary)" : "var(--primary)") : "var(--bg-card2)",
                  border: `2px solid ${done ? "var(--primary)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: done ? "white" : "var(--text-muted)",
                  transition: "all 0.5s",
                  animation: active && current < 3 ? "pulse 1.5s infinite" : "none",
                  boxShadow: active ? "0 0 20px rgba(255,69,0,0.4)" : "none"
                }}>
                  {i < current ? <CheckCircle size={24} /> : stage.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "Syne", fontWeight: 700, fontSize: 16,
                    color: done ? "var(--text)" : "var(--text-muted)",
                    marginBottom: 4
                  }}>
                    {stage.label}
                  </div>
                  <div style={{ fontSize: 13, color: done ? "var(--text-muted)" : "#555" }}>
                    {stage.desc}
                  </div>
                </div>

                {/* Status indicator */}
                {active && current < 3 && (
                  <div style={{
                    background: "rgba(255,69,0,0.1)", border: "1px solid rgba(255,69,0,0.3)",
                    padding: "4px 12px", borderRadius: "50px", fontSize: 12, fontWeight: 700, color: "var(--primary)"
                  }}>
                    In Progress
                  </div>
                )}
                {i < current && (
                  <div style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700 }}>✓ Done</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Rider info */}
        {current >= 2 && current < 3 && (
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "16px", padding: "20px", marginTop: 40,
            display: "flex", alignItems: "center", gap: "16px"
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", background: "rgba(255,69,0,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24
            }}>
              🛵
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>Rajan Kumar</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Your delivery partner</div>
            </div>
            <div style={{ fontFamily: "Syne", fontWeight: 800, color: "var(--primary)", fontSize: 18 }}>
              📞 +91 98765 43210
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "16px", marginTop: 40, flexWrap: "wrap" }}>
          <Link to="/orders" className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", padding: "14px" }}>
            All Orders
          </Link>
          <Link to="/menu" className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: "14px" }}>
            Order Again
          </Link>
        </div>
      </div>
    </div>
  );
}
