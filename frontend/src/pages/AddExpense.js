import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000"; // Change if needed

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
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount: </label>
          <input
            type="number"
            value={amount}
            required
            min="0"
            step="0.01"
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label>Category: </label>
          <input
            type="text"
            value={category}
            required
            onChange={e => setCategory(e.target.value)}
          />
        </div>
        <div>
          <label>Description: </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Add Expense</button>
      </form>
      {message && <div style={{ color: "green", marginTop: 10 }}>{message}</div>}
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
    </div>
  );
}