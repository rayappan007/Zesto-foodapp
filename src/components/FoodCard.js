import React from "react";
import { Link } from "react-router-dom";
import { Plus, Star, ShoppingCart } from "lucide-react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

export default function FoodCard({ item }) {
  const { state, dispatch } = useApp();
  const inCart = state.cart.find(c => c.food_id === item.food_id);

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!state.user) {
      toast.error("Please login to add items!");
      return;
    }
    dispatch({ type: "ADD_TO_CART", payload: item });
    toast.success(`${item.name} added to cart!`);
  };

  const stars = Math.round(item.rating);

  return (
    <Link to={`/food/${item.food_id}`} style={{ textDecoration: "none" }}>
      <div className="food-card">
        <div style={{ overflow: "hidden", position: "relative" }}>
          <img
            src={item.image}
            alt={item.name}
            className="food-card-img"
            onError={e => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"; }}
          />
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            padding: "4px 10px", borderRadius: "50px",
            display: "flex", alignItems: "center", gap: "4px"
          }}>
            <Star size={12} fill="#FFB347" color="#FFB347" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#FFB347" }}>{item.rating}</span>
          </div>
        </div>
        <div className="food-card-body">
          <div className="food-card-category">{item.category}</div>
          <div className="food-card-name">{item.name}</div>
          <div className="food-card-desc">{item.description}</div>
          <div className="food-card-footer">
            <div className="food-price">₹{item.price}</div>
            <button
              onClick={addToCart}
              className={`add-btn ${inCart ? "added" : ""}`}
            >
              {inCart ? (
                <>
                  <ShoppingCart size={14} />
                  In Cart ({inCart.quantity})
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
