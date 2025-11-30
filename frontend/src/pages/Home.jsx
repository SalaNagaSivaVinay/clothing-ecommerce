import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [size, setSize] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products?page=${page}&limit=${limit}&category=${category}&size=${size}&search=${search}`
      );
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, size, search, page]);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Guest cart
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const existing = guestCart.find(
        (item) => item.product._id === product._id && item.size === "M"
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        guestCart.push({ product, quantity: 1, size: "M" });
      }
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      alert("Added to cart (guest)");
      return;
    }

    // Logged-in user
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity: 1, size: "M" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h2>Products</h2>

      {/* Filters */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          <option>Men</option>
          <option>Women</option>
          <option>Kids</option>
        </select>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option>All</option>
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
        </select>
      </div>

      {/* Products Grid */}
<div style={{ display: "flex", flexWrap: "wrap" }}>
  {products.map((p) => (
    <div
      key={p._id}
      style={{
        border: "1px solid #ccc",
        margin: "10px",
        padding: "10px",
        width: "220px",
        borderRadius: "8px",
        cursor: "pointer",
        background: "#fff",
      }}
    >
      <Link
        to={`/product/${p._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={p.image}
          alt={p.name}
          width="200"
          style={{ borderRadius: "5px" }}
        />
        <h4 style={{ marginTop: "10px" }}>{p.name}</h4>
        <p style={{ color: "green", fontWeight: "bold" }}>${p.price}</p>
      </Link>

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent navigation
            handleAddToCart(p._id);
          }}
          style={{
            flex: 1,
            background: "#333",
            color: "#fff",
            borderRadius: "5px",
          }}
        >
          Add to Cart
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/product/${p._id}`;
          }}
          style={{
            flex: 1,
            background: "#ff6600",
            color: "#fff",
            borderRadius: "5px",
          }}
        >
          Order Now
        </button>
      </div>
    </div>
  ))}
</div>


      {/* Pagination */}
      <div style={{ marginTop: "20px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            style={{
              marginRight: "5px",
              backgroundColor: page === i + 1 ? "#333" : "#fff",
              color: page === i + 1 ? "#fff" : "#000",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
