import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!product) return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h2>;

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      padding: "40px",
      background: "#f2f2f2",
      minHeight: "100vh"
    }}>
      <div style={{
        width: "90%",
        maxWidth: "900px",
        background: "#fff",
        padding: "30px",
        borderRadius: "18px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "row",
        gap: "30px"
      }}>
        
        {/* LEFT SIDE IMAGE */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <img 
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              maxWidth: "350px",
              borderRadius: "12px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.15)"
            }}
          />
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: "28px",
            marginBottom: "10px",
            color: "#333",
            fontWeight: "700"
          }}>{product.name}</h1>

          <p style={{ fontSize: "20px", marginBottom: "12px", color: "#444" }}>
            <strong>Price:</strong> <span style={{ color: "green" }}>₹{product.price}</span>
          </p>

          <p style={{ marginBottom: "12px", lineHeight: "1.6", color: "#555" }}>
            <strong>Description:</strong> {product.description}
          </p>

          <p style={{ marginBottom: "12px", fontSize: "16px", color: "#555" }}>
            <strong>Category:</strong> {product.category}
          </p>

          <p style={{ marginBottom: "20px", color: "#555" }}>
            <strong>Sizes:</strong>{" "}
            {product.sizes?.length > 0 ? product.sizes.join(", ") : "No sizes available"}
          </p>

          {/* BUTTONS */}
          <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
            
            {/* Add to Cart Button */}
            <button style={{
              padding: "12px 22px",
              background: "#ff7b00",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "0.3s"
            }}
              onClick={() => alert("Added to Cart!")}
              onMouseEnter={(e) => e.target.style.background = "#e06800"}
              onMouseLeave={(e) => e.target.style.background = "#ff7b00"}
            >
              Add to Cart
            </button>

            {/* Order Now Button */}
            <button style={{
              padding: "12px 22px",
              background: "#008CFF",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "0.3s"
            }}
              onClick={() => alert("Order placed!")}
              onMouseEnter={(e) => e.target.style.background = "#006fcc"}
              onMouseLeave={(e) => e.target.style.background = "#008CFF"}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
