import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LogOut, Package, UtensilsCrossed, Plus, Edit2, Trash2, Save, X, ChevronDown, BarChart3 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { foodItems as initialFoodItems, categories } from "../data/foodData";
import toast from "react-hot-toast";

const statusOrder = ["placed", "preparing", "delivery", "delivered"];
const statusLabels = { placed: "Order Placed", preparing: "Preparing", delivery: "Out for Delivery", delivered: "Delivered" };
const statusColors = { placed: "#FFB347", preparing: "#3498db", delivery: "#9b59b6", delivered: "#2ecc71" };

export default function AdminDashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders");
  const [foods, setFoods] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("zesto_admin_foods") || "null");
    return saved || initialFoodItems;
  });
  const [editItem, setEditItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "Pizza", price: "", rating: "4.0", description: "", image: "" });

  const logout = () => {
    dispatch({ type: "ADMIN_LOGOUT" });
    navigate("/admin/login");
    toast.success("Logged out");
  };

  const updateStatus = (order_id, newStatus) => {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { order_id, status: newStatus } });
    toast.success(`Order status updated to "${statusLabels[newStatus]}"`);
  };

  const saveFoods = (updated) => {
    setFoods(updated);
    localStorage.setItem("zesto_admin_foods", JSON.stringify(updated));
  };

  const deleteFood = (food_id) => {
    if (!window.confirm("Delete this item?")) return;
    saveFoods(foods.filter(f => f.food_id !== food_id));
    toast.success("Item deleted");
  };

  const startEdit = (item) => {
    setEditItem({ ...item });
    setShowAddForm(false);
  };

  const saveEdit = () => {
    saveFoods(foods.map(f => f.food_id === editItem.food_id ? editItem : f));
    setEditItem(null);
    toast.success("Item updated!");
  };

  const addItem = () => {
    if (!newItem.name || !newItem.price) { toast.error("Name and price are required"); return; }
    const item = {
      ...newItem,
      food_id: Date.now(),
      price: parseFloat(newItem.price),
      rating: parseFloat(newItem.rating),
      image: newItem.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"
    };
    saveFoods([...foods, item]);
    setNewItem({ name: "", category: "Pizza", price: "", rating: "4.0", description: "", image: "" });
    setShowAddForm(false);
    toast.success("Item added!");
  };

  const totalRevenue = state.orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Admin Navbar */}
      <nav style={{
        background: "rgba(15,15,15,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)", padding: "0 24px",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#9b59b6,#6c3483)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={18} color="white" />
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18 }}>
            Zesto <span style={{ color: "#9b59b6" }}>Admin</span>
          </span>
        </div>
        <button onClick={logout} className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>
          <LogOut size={15} /> Logout
        </button>
      </nav>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: 32 }}>
          {[
            { label: "Total Orders", val: state.orders.length, icon: "📦", color: "#FFB347" },
            { label: "Total Revenue", val: `₹${totalRevenue}`, icon: "💰", color: "#2ecc71" },
            { label: "Menu Items", val: foods.length, icon: "🍽️", color: "#3498db" },
            { label: "Delivered", val: state.orders.filter(o => o.status === "delivered").length, icon: "✅", color: "#9b59b6" },
          ].map(s => (
            <div key={s.label} style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "16px", padding: "20px 24px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 28, color: s.color }}>{s.val}</div>
                </div>
                <span style={{ fontSize: 32 }}>{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: 24 }}>
          {[
            { id: "orders", label: "Orders", icon: <Package size={16} /> },
            { id: "food", label: "Food Items", icon: <UtensilsCrossed size={16} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer",
              background: tab === t.id ? "#9b59b6" : "var(--bg-card2)",
              color: tab === t.id ? "white" : "var(--text-muted)",
              fontWeight: 700, fontSize: 14, transition: "all 0.2s"
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div>
            {state.orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
                <h3 style={{ fontFamily: "Syne" }}>No orders yet</h3>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {state.orders.map(order => (
                  <div key={order.order_id} style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "16px", padding: "20px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                      <div>
                        <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 16, marginBottom: 4 }}>#{order.order_id}</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                          {new Date(order.order_date).toLocaleString()} · {order.delivery_address?.slice(0, 40)}...
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                        <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, color: "#2ecc71" }}>₹{order.total}</div>
                        {/* Status selector */}
                        <div style={{ position: "relative" }}>
                          <select
                            value={order.status}
                            onChange={e => updateStatus(order.order_id, e.target.value)}
                            style={{
                              padding: "8px 32px 8px 14px", borderRadius: "8px", fontSize: 13, fontWeight: 700,
                              background: `${statusColors[order.status]}22`,
                              border: `1px solid ${statusColors[order.status]}44`,
                              color: statusColors[order.status],
                              cursor: "pointer", appearance: "none"
                            }}
                          >
                            {statusOrder.map(s => (
                              <option key={s} value={s} style={{ background: "var(--bg-card)", color: "var(--text)" }}>{statusLabels[s]}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: statusColors[order.status] }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {order.items?.map(item => (
                        <span key={item.food_id} style={{
                          padding: "4px 12px", background: "var(--bg-card2)", borderRadius: "50px", fontSize: 12, color: "var(--text-muted)"
                        }}>
                          {item.name} ×{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Food Management Tab */}
        {tab === "food" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20 }}>Food Items ({foods.length})</h2>
              <button onClick={() => { setShowAddForm(true); setEditItem(null); }}
                className="btn btn-primary" style={{ padding: "10px 20px" }}>
                <Plus size={16} /> Add Item
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div style={{ background: "var(--bg-card)", border: "1px solid rgba(155,89,182,0.3)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "Syne", fontWeight: 800 }}>Add New Item</h3>
                  <button onClick={() => setShowAddForm(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={18} /></button>
                </div>
                <div className="form-row" style={{ marginBottom: 12 }}>
                  <div><label className="form-label">Name</label><input value={newItem.name} onChange={e => setNewItem(n => ({ ...n, name: e.target.value }))} placeholder="Dish name" /></div>
                  <div><label className="form-label">Category</label>
                    <select value={newItem.category} onChange={e => setNewItem(n => ({ ...n, category: e.target.value }))}>
                      {categories.filter(c => c.id !== "all").map(c => <option key={c.id}>{c.id}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row" style={{ marginBottom: 12 }}>
                  <div><label className="form-label">Price (₹)</label><input type="number" value={newItem.price} onChange={e => setNewItem(n => ({ ...n, price: e.target.value }))} placeholder="199" /></div>
                  <div><label className="form-label">Rating</label><input type="number" min="1" max="5" step="0.1" value={newItem.rating} onChange={e => setNewItem(n => ({ ...n, rating: e.target.value }))} /></div>
                </div>
                <div style={{ marginBottom: 12 }}><label className="form-label">Description</label><input value={newItem.description} onChange={e => setNewItem(n => ({ ...n, description: e.target.value }))} placeholder="Describe the dish..." /></div>
                <div style={{ marginBottom: 16 }}><label className="form-label">Image URL (optional)</label><input value={newItem.image} onChange={e => setNewItem(n => ({ ...n, image: e.target.value }))} placeholder="https://..." /></div>
                <button onClick={addItem} className="btn btn-primary"><Save size={16} /> Add Item</button>
              </div>
            )}

            {/* Foods table */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {foods.map(item => (
                <div key={item.food_id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px" }}>
                  {editItem?.food_id === item.food_id ? (
                    <div>
                      <div className="form-row" style={{ marginBottom: 10 }}>
                        <div><label className="form-label">Name</label><input value={editItem.name} onChange={e => setEditItem(ei => ({ ...ei, name: e.target.value }))} /></div>
                        <div><label className="form-label">Category</label>
                          <select value={editItem.category} onChange={e => setEditItem(ei => ({ ...ei, category: e.target.value }))}>
                            {categories.filter(c => c.id !== "all").map(c => <option key={c.id}>{c.id}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="form-row" style={{ marginBottom: 10 }}>
                        <div><label className="form-label">Price</label><input type="number" value={editItem.price} onChange={e => setEditItem(ei => ({ ...ei, price: parseFloat(e.target.value) }))} /></div>
                        <div><label className="form-label">Rating</label><input type="number" min="1" max="5" step="0.1" value={editItem.rating} onChange={e => setEditItem(ei => ({ ...ei, rating: parseFloat(e.target.value) }))} /></div>
                      </div>
                      <div style={{ marginBottom: 12 }}><label className="form-label">Description</label><input value={editItem.description} onChange={e => setEditItem(ei => ({ ...ei, description: e.target.value }))} /></div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={saveEdit} className="btn btn-primary" style={{ padding: "8px 16px" }}><Save size={14} /> Save</button>
                        <button onClick={() => setEditItem(null)} className="btn btn-ghost" style={{ padding: "8px 16px" }}><X size={14} /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                      <img src={item.image} alt={item.name} style={{ width: 60, height: 60, borderRadius: "10px", objectFit: "cover", flexShrink: 0 }}
                        onError={e => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80"; }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{item.category} · ⭐{item.rating}</div>
                      </div>
                      <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18, color: "var(--primary)", flexShrink: 0 }}>₹{item.price}</div>
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <button onClick={() => startEdit(item)} style={{ width: 36, height: 36, borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-card2)", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteFood(item.food_id)} style={{ width: 36, height: 36, borderRadius: "8px", border: "1px solid rgba(255,50,50,0.3)", background: "rgba(255,50,50,0.1)", color: "#ff5555", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
