import React, { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem("zesto_user")) || null,
  cart: JSON.parse(localStorage.getItem("zesto_cart")) || [],
  orders: JSON.parse(localStorage.getItem("zesto_orders")) || [],
  isAdmin: JSON.parse(localStorage.getItem("zesto_admin")) || false,
};

function reducer(state, action) {
  let newState;
  switch (action.type) {
    case "LOGIN":
      newState = { ...state, user: action.payload };
      localStorage.setItem("zesto_user", JSON.stringify(action.payload));
      return newState;
    case "LOGOUT":
      localStorage.removeItem("zesto_user");
      localStorage.removeItem("zesto_cart");
      return { ...state, user: null, cart: [], isAdmin: false };
    case "ADMIN_LOGIN":
      newState = { ...state, isAdmin: true };
      localStorage.setItem("zesto_admin", JSON.stringify(true));
      return newState;
    case "ADMIN_LOGOUT":
      localStorage.removeItem("zesto_admin");
      return { ...state, isAdmin: false };
    case "ADD_TO_CART": {
      const existing = state.cart.find((i) => i.food_id === action.payload.food_id);
      let newCart;
      if (existing) {
        newCart = state.cart.map((i) =>
          i.food_id === action.payload.food_id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      localStorage.setItem("zesto_cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    case "REMOVE_FROM_CART": {
      const newCart = state.cart.filter((i) => i.food_id !== action.payload);
      localStorage.setItem("zesto_cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    case "UPDATE_QUANTITY": {
      const newCart = state.cart.map((i) =>
        i.food_id === action.payload.food_id ? { ...i, quantity: action.payload.quantity } : i
      );
      localStorage.setItem("zesto_cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    case "CLEAR_CART":
      localStorage.removeItem("zesto_cart");
      return { ...state, cart: [] };
    case "PLACE_ORDER": {
      const newOrders = [action.payload, ...state.orders];
      localStorage.setItem("zesto_orders", JSON.stringify(newOrders));
      return { ...state, orders: newOrders };
    }
    case "UPDATE_ORDER_STATUS": {
      const newOrders = state.orders.map((o) =>
        o.order_id === action.payload.order_id ? { ...o, status: action.payload.status } : o
      );
      localStorage.setItem("zesto_orders", JSON.stringify(newOrders));
      return { ...state, orders: newOrders };
    }
    case "SET_FOOD_ITEMS":
      return { ...state, foodItems: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const cartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <AppContext.Provider value={{ state, dispatch, cartCount, cartTotal }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
