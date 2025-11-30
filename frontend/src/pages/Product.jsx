import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`);
      setProducts(res.data.products);
    } catch (err) {
      console.error("❌ Failed to load products:", err);
    }
  };
  fetchProducts();
}, []);


  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Products</h2>

      {/* PRODUCT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {products.map((p) => (
          <div
            key={p._id}
            onClick={() => navigate(`/product/${p._id}`)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              transition: "0.2s",
              background: "#fff"
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "contain",
                borderRadius: "8px",
                background: "#f9f9f9"
              }}
            />

            <h4 style={{ margin: "10px 0" }}>{p.name}</h4>

            <p style={{ fontSize: "14px", color: "#666" }}>
              {p.description?.slice(0, 40)}...
            </p>

            <p
              style={{
                fontWeight: "bold",
                marginTop: "8px",
                fontSize: "16px"
              }}
            >
              ₹{p.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
