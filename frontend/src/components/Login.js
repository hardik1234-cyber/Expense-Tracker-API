import React, { useState } from "react";
import API from "../api";
import "./Auth.css";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("username", form.username);
      formData.append("password", form.password);

      const res = await API.post("/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // Save token and username
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("username", form.username);

      setErrorMessage(""); // clear error if login succeeds

      // Redirect to Dashboard page
      window.location.href = "/reportdashboard";
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>EXPENSE TRACKER</h2>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Sign In</button>

        {/* Show error message if it exists */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <div className="auth-options">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
