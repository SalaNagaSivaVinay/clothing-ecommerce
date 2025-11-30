import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <BrowserRouter>

      {/* 🔥 MAIN CENTER WRAPPER */}
      <div className="main-container">

        {/* 🔥 PREMIUM NAVBAR */}
        <nav className="navbar">
          <Link className="nav-brand" to="/">BrandCart</Link>

          <div className="nav-links">
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>

            {token ? (
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </nav>

        {/* 🔥 ROUTES */}
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
