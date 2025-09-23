import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ReportDashboard() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearlyDropdown, setYearlyDropdown] = useState(false);

  const [monthlyExpenseData, setMonthlyExpenseData] = useState(null);
  const [yearlyExpenseData, setYearlyExpenseData] = useState(null);

  const [error, setError] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#AF19FF"];
  const years = [2023, 2024, 2025];

  // Fetch Monthly
  const handleFetchMonthly = async () => {
    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      const res = await API.get("/get_monthly_expense", {
        params: { username, month, year },
        headers: { Authorization: `Bearer ${token}` },
      });

      setMonthlyExpenseData(res.data);
      setYearlyExpenseData(null);
      setError("");
    } catch (err) {
      setMonthlyExpenseData(null);
      setError(err.response?.data?.detail || "Failed to fetch monthly expenses");
    }
  };

  // Fetch Yearly
  const handleFetchYearly = async (selectedYear) => {
    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      const res = await API.get("/get_yearly_expense", {
        params: { username, year: selectedYear },
        headers: { Authorization: `Bearer ${token}` },
      });

      setYearlyExpenseData(res.data);
      setMonthlyExpenseData(null);
      setYear(selectedYear);
      setError("");
    } catch (err) {
      setYearlyExpenseData(null);
      setError(err.response?.data?.detail || "Failed to fetch yearly expenses");
    }
  };

  const handleMonthChange = (e) => setMonth(parseInt(e.target.value));
  const handleYearChange = (e) => setYear(parseInt(e.target.value));

  // Auto-load current month data on mount
  useEffect(() => {
    handleFetchMonthly();
    // eslint-disable-next-line
  }, []);

  // When month or year changes, fetch monthly report
  useEffect(() => {
    if (monthlyExpenseData !== null) {
      handleFetchMonthly();
    }
    // eslint-disable-next-line
  }, [month, year]);

  // Table style for thin, centered, elevated table
  const tableStyle = {
    margin: "40px auto 0 auto",
    borderCollapse: "collapse",
    width: "60%",
    minWidth: 350,
    maxWidth: 700,
    fontSize: "1rem",
    background: "rgba(255,255,255,0.97)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    textAlign: "center",
    borderRadius: "18px",
    overflow: "hidden",
    padding: "18px 0"
  };

  // Card style for total expense
  const totalCardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "30px auto 20px auto",
    padding: "18px 32px",
    background: "rgba(255,255,255,0.85)",
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    maxWidth: 480,
  };

  // Table header style
  const thStyle = {
    background: "#f7f7f7",
    fontWeight: 700,
    fontSize: "1.1rem",
    padding: "12px 0"
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* User Icon, Add Expense, and Yearly Dropdown at top right */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 30,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Link to="/user-management" title="User Management">
          <span
            style={{
              fontSize: "2rem",
              cursor: "pointer",
              borderRadius: "50%",
              padding: "6px",
              background: "#f3f3f3",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              display: "inline-block",
            }}
          >
            👤
          </span>
        </Link>
        {/* Add Expense Button */}
        <Link to="/add-expense" style={{ marginTop: "20px", textDecoration: "none" }}>
          <button
            style={{
              padding: "8px 18px",
              backgroundColor: "#6c63ff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            + Add Expense
          </button>
        </Link>
        {/* Yearly Dropdown */}
        <div style={{ marginTop: "20px", position: "relative" }}>
          <button
            onClick={() => setYearlyDropdown((v) => !v)}
            style={{
              padding: "10px 24px",
              backgroundColor: "#00C49F",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              cursor: "pointer",
              minWidth: 180,
            }}
          >
            Fetch Yearly Report
          </button>
          {yearlyDropdown && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                right: 0,
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "6px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                zIndex: 1001,
                minWidth: 180,
              }}
            >
              {years.map((y) => (
                <div
                  key={y}
                  onClick={() => {
                    handleFetchYearly(y);
                    setYearlyDropdown(false);
                  }}
                  style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    background: y === year ? "#f3f3f3" : "#fff",
                  }}
                >
                  {y}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h1 style={{ display: "flex", alignItems: "center" }}>
        📊 Reporting Dashboard
      </h1>

      {/* Centered Filters */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "30px 0 10px 0"
      }}>
        <select value={month} onChange={handleMonthChange}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={handleYearChange}
          style={{ marginLeft: "10px" }}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* Monthly Button */}
        <button
          onClick={handleFetchMonthly}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: "#0088FE",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Fetch Monthly Report
        </button>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* ------------------ Monthly Results ------------------ */}
      {monthlyExpenseData && (
        <div style={{ marginTop: "30px" }}>
          <div style={totalCardStyle}>
            <span style={{ fontSize: "1.2rem", color: "#333", fontWeight: 500 }}>
              Total Expense for {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
            </span>
            <span style={{ fontSize: "2.2rem", color: "#0088FE", fontWeight: 700, marginTop: 6 }}>
              ₹{monthlyExpenseData.total_expenses}
            </span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(monthlyExpenseData.category_breakdown).map(
                  ([key, value]) => ({ name: key, value })
                )}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {Object.entries(monthlyExpenseData.category_breakdown).map(
                  ([_, value], index) => (
                    <Cell
                      key={`cell-m-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div style={tableStyle}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "transparent" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(monthlyExpenseData.category_breakdown).map(
                  ([category, amount], idx) => (
                    <tr
                      key={category}
                      onMouseEnter={() => setHoveredRow(idx)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{ position: "relative" }}
                    >
                      <td style={{ position: "relative" }}>
                        {category}
                      </td>
                      <td>{amount}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------ Yearly Results ------------------ */}
      {yearlyExpenseData && (
        <div style={{ marginTop: "50px" }}>
          <div style={totalCardStyle}>
            <span style={{ fontSize: "1.2rem", color: "#333", fontWeight: 500 }}>
              Total Expense for {yearlyExpenseData.year}
            </span>
            <span style={{ fontSize: "2.2rem", color: "#00C49F", fontWeight: 700, marginTop: 6 }}>
              ₹{yearlyExpenseData.total_expenses}
            </span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(yearlyExpenseData.category_breakdown).map(
                  ([key, value]) => ({ name: key, value })
                )}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {Object.entries(yearlyExpenseData.category_breakdown).map(
                  ([_, value], index) => (
                    <Cell
                      key={`cell-y-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div style={tableStyle}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "transparent" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(yearlyExpenseData.category_breakdown).map(
                  ([category, amount]) => (
                    <tr key={category}>
                      <td>{category}</td>
                      <td>{amount}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportDashboard;