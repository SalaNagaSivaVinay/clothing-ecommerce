import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      // Merge guest cart
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

      if (guestCart.length > 0) {
        for (let item of guestCart) {
          await axios.post(
            `${API}/api/cart`,
            {
              productId: item.product,
              size: item.size,
              quantity: item.quantity,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        localStorage.removeItem("guestCart");
      }

      navigate("/"); // redirect to home
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
