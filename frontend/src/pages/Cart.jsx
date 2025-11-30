import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart (user or guest)
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        setCartItems(guestCart);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemove = async (index) => {
    const token = localStorage.getItem("token");
    const item = cartItems[index];

    if (!token) {
      const updated = [...cartItems];
      updated.splice(index, 1);
      localStorage.setItem("guestCart", JSON.stringify(updated));
      setCartItems(updated);
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/cart/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  const handleQuantityChange = async (index, delta) => {
    const updated = [...cartItems];
    updated[index].quantity += delta;
    if (updated[index].quantity < 1) updated[index].quantity = 1;
    setCartItems(updated);

    const token = localStorage.getItem("token");
    const item = updated[index];

    if (!token) {
      localStorage.setItem("guestCart", JSON.stringify(updated));
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/cart/${item._id}`,
        { quantity: item.quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity");
    }
  };

  const handleCheckout = () => navigate("/checkout");

  if (loading) return <p>Loading cart...</p>;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div style={{ margin: "20px" }}>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4>{item.product.name}</h4>
                <p>Size: {item.size}</p>
                <p>Price: ${item.product.price}</p>
              </div>
              <div>
                <button onClick={() => handleQuantityChange(idx, -1)}>-</button>
                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(idx, 1)}>+</button>
                <button
                  onClick={() => handleRemove(idx)}
                  style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <button onClick={handleCheckout} disabled={cartItems.length === 0}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
