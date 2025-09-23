import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://xpense-tracker-backend-l6dk.onrender.com"; // Change if needed

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      const res = await fetch(`${API_URL}/add_expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          amount: parseFloat(amount),
          category,
          description,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to add expense");
      setMessage("Expense added successfully!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div style={{ maxWidth: 400, width: "100%", background: "rgba(255,255,255,0.95)", padding: 32, borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Add Expense</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Amount:</label>
            <input
              type="number"
              value={amount}
              required
              min="0"
              step="0.01"
              onChange={e => setAmount(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Category:</label>
            <input
              type="text"
              value={category}
              required
              onChange={e => setCategory(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Description:</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: "#6c63ff",
              color: "white",
              border: "none",
              borderRadius: 5,
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            Add Expense
          </button>
        </form>
        {message && <div style={{ color: "green", marginTop: 16, textAlign: "center" }}>{message}</div>}
        {error && <div style={{ color: "red", marginTop: 16, textAlign: "center" }}>{error}</div>}
      </div>
    </div>
  );
}