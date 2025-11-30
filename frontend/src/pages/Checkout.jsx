import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [order, setOrder] = useState(null); // New: store placed order
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCartItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return alert("Cart is empty!");

    try {
      setPlacingOrder(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: cartItems.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            size: item.size,
          })),
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // Show confirmation page instead of alert
      setOrder(res.data);
      setCartItems([]); // clear cart

    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <p>Loading cart...</p>;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Show Order Confirmation
  if (order) {
    return (
      <div style={{ margin: "20px" }}>
        <h2>Order Confirmed!</h2>
        <p>Order ID: {order._id}</p>
        <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
        <p>Total: ${order.total}</p>
        <h3>Items:</h3>
        {order.items.map((item, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>{item.product.name}</p>
            <p>Size: {item.size}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.product.price}</p>
          </div>
        ))}
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Checkout</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h4>{item.product.name}</h4>
              <p>Size: {item.size}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.product.price}</p>
            </div>
          ))}
          <h3>Total: ${totalPrice}</h3>
          <button onClick={handlePlaceOrder} disabled={placingOrder}>
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}
