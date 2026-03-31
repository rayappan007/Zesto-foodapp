import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { foodItems, categories } from "../data/foodData";
import FoodCard from "../components/FoodCard";

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("cat") || "all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("cat");
    if (q) setSearch(q);
    if (cat) setActiveCategory(cat);
  }, []);

  let filtered = [...foodItems];

  if (search.trim()) {
    filtered = filtered.filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (activeCategory !== "all") {
    filtered = filtered.filter(f => f.category === activeCategory);
  }

  if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);
  else if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setSearchParams({});
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Our <span style={{ color: "var(--primary)" }}>Menu</span></h1>
          <p>{filtered.length} delicious items available</p>
        </div>

        {/* Search + Sort */}
        <div style={{
          display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap"
        }}>
          <div style={{
            flex: 1, minWidth: 240, position: "relative",
            display: "flex", alignItems: "center",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "0 16px"
          }}>
            <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dishes..."
              style={{ border: "none", background: "none", padding: "14px 12px", flex: 1, fontSize: 14 }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--text-muted)", padding: "4px", cursor: "pointer" }}>
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SlidersHorizontal size={18} color="var(--text-muted)" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ minWidth: 160, padding: "12px 16px", fontSize: 14 }}
            >
              <option value="default">Sort: Default</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: "flex", gap: "8px", overflowX: "auto",
          paddingBottom: "8px", marginBottom: "32px"
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id)}
              style={{
                flexShrink: 0,
                padding: "10px 20px", borderRadius: "50px", border: "none",
                background: activeCategory === cat.id ? "var(--primary)" : "var(--bg-card)",
                color: activeCategory === cat.id ? "white" : "var(--text-muted)",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                border: `1px solid ${activeCategory === cat.id ? "var(--primary)" : "var(--border)"}`,
                transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px"
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "Syne", fontSize: 24, marginBottom: 8 }}>No results found</h3>
            <p style={{ color: "var(--text-muted)" }}>Try a different search or category</p>
            <button onClick={() => { setSearch(""); setActiveCategory("all"); }}
              className="btn btn-primary" style={{ marginTop: 24 }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="food-grid" style={{ paddingBottom: 64 }}>
            {filtered.map(item => <FoodCard key={item.food_id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
