import React, { useState } from "react";
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

  const [monthlyExpenseData, setMonthlyExpenseData] = useState(null);
  const [yearlyExpenseData, setYearlyExpenseData] = useState(null);

  const [error, setError] = useState("");

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#AF19FF"];

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
      setError("");
    } catch (err) {
      setMonthlyExpenseData(null);
      setError(err.response?.data?.detail || "Failed to fetch monthly expenses");
    }
  };

  // Fetch Yearly
  const handleFetchYearly = async () => {
    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      const res = await API.get("/get_yearly_expense", {
        params: { username, year },
        headers: { Authorization: `Bearer ${token}` },
      });

      setYearlyExpenseData(res.data);
      setError("");
    } catch (err) {
      setYearlyExpenseData(null);
      setError(err.response?.data?.detail || "Failed to fetch yearly expenses");
    }
  };

  const handleMonthChange = (e) => setMonth(parseInt(e.target.value));
  const handleYearChange = (e) => setYear(parseInt(e.target.value));

  return (
    <div style={{ padding: "20px" }}>
      {/* User Icon at top right */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 30,
          zIndex: 1000,
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
      </div>

      <h1 style={{ display: "flex", alignItems: "center" }}>
        📊 Reporting Dashboard
      </h1>

      {/* Filters */}
      <div style={{ margin: "20px 0" }}>
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
          {[2023, 2024, 2025].map((y) => (
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

        {/* Yearly Button */}
        <button
          onClick={handleFetchYearly}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: "#00C49F",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Fetch Yearly Report
        </button>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ------------------ Monthly Results ------------------ */}
      {monthlyExpenseData && (
        <div style={{ marginTop: "30px" }}>
          <h2>
            Total Expense for {monthlyExpenseData.month} {year}: $
            {monthlyExpenseData.total_expenses}
          </h2>

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

          <table
            border="1"
            cellPadding="10"
            style={{
              marginTop: "20px",
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(monthlyExpenseData.category_breakdown).map(
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
      )}

      {/* ------------------ Yearly Results ------------------ */}
      {yearlyExpenseData && (
        <div style={{ marginTop: "50px" }}>
          <h2>
            Total Expense for {yearlyExpenseData.year}: $
            {yearlyExpenseData.total_expenses}
          </h2>

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

          <table
            border="1"
            cellPadding="10"
            style={{
              marginTop: "20px",
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
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
      )}
    </div>
  );
}

export default ReportDashboard;