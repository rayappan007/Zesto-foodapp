# 🍕 Zesto — Food Ordering App

A complete, production-ready food ordering web app built with React.js.

## Features

- **150+ food items** across 8 categories (Pizza, Burger, Biryani, Chinese, South Indian, Desserts, Beverages, Snacks)
- **User Authentication** — Signup, Login, Session persistence via localStorage
- **Food Menu** — Search, filter by category, sort by price/rating
- **Food Detail Pages** — Full description, quantity selector, related items
- **Cart System** — Add/remove/update items with live totals
- **Checkout** — Delivery details, 3 payment methods, coupon codes
- **Order Confirmation** — Order ID, summary, estimated delivery time
- **Order Tracking** — Visual 4-stage progress tracker with auto-advance simulation
- **Order History** — All past orders with status
- **Admin Panel** — Order management (update status), Food management (add/edit/delete)
- **Responsive Design** — Mobile + desktop optimized
- **Dark theme** with warm orange accent colors

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Steps

1. **Extract the zip** to a folder

2. **Install dependencies**
   ```bash
   cd foodapp
   npm install
   ```

3. **Start the app**
   ```bash
   npm start
   ```
   The app opens at `http://localhost:3000`

## Demo Credentials

### User Login
| Email | Password |
|-------|----------|
| demo@zesto.com | demo123 |
| test@user.com | test123 |

### Admin Login
| Email | Password |
|-------|----------|
| admin@zesto.com | admin123 |

Access admin panel at: `http://localhost:3000/admin/login`

## Coupon Codes

| Code | Discount |
|------|----------|
| ZESTO10 | 10% off all orders |
| SAVE50 | Flat ₹50 off |
| WELCOME20 | 20% off |
| FEAST100 | ₹100 off (orders above ₹599) |

## Project Structure

```
src/
├── components/
│   ├── Navbar.js         — Top navigation with cart badge
│   └── FoodCard.js       — Reusable food card component
├── context/
│   └── AppContext.js     — Global state (cart, user, orders)
├── data/
│   └── foodData.js       — 150+ food items + categories + coupons
├── pages/
│   ├── Home.js           — Landing page with hero, categories, popular items
│   ├── Menu.js           — Full menu with search/filter/sort
│   ├── FoodDetail.js     — Individual food item page
│   ├── Cart.js           — Shopping cart
│   ├── Checkout.js       — Order placement with coupon support
│   ├── OrderConfirmation.js — Success page after order
│   ├── Orders.js         — Order history
│   ├── OrderTracking.js  — Live order tracking with stages
│   ├── Login.js          — User login
│   ├── Signup.js         — New user registration
│   ├── AdminLogin.js     — Admin authentication
│   └── AdminDashboard.js — Admin panel (orders + food management)
└── index.css             — Global styles with CSS variables
```

## Notes

- All data is stored in **localStorage** (simulates a database)
- No backend required — fully frontend React app
- To reset all data: clear localStorage in browser DevTools
- Order tracking auto-advances through stages every ~5 seconds for demo

## Tech Stack

- React 18 + React Router v6
- Context API + useReducer for state management
- CSS Variables for theming
- Lucide React for icons
- React Hot Toast for notifications
- Google Fonts (Syne + DM Sans)
- localStorage for persistence
