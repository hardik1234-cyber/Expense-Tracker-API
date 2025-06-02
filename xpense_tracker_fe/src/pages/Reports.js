import React, { useState } from 'react';
import { api, setAuthToken } from '../api/api';
import './Login.css';

function Reports() {
  const [monthly, setMonthly] = useState(null);
  const [yearly, setYearly] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const username = localStorage.getItem('username');

  const fetchMonthly = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setAuthToken(token);
    try {
      const res = await api.get('/get_monthly_expense', {
        params: { username, month: Number(month), year: Number(year) }
      });
      setMonthly(res.data);
    } catch {
      setMonthly(null);
      alert('Failed to fetch monthly report');
    }
  };

  const fetchYearly = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setAuthToken(token);
    try {
      const res = await api.get('/get_yearly_expense', {
        params: { username, year: Number(year) }
      });
      setYearly(res.data);
    } catch {
      setYearly(null);
      alert('Failed to fetch yearly report');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card" style={{ maxWidth: 600 }}>
        <h2 className="login-title">Reports</h2>
        <form style={{ marginBottom: 32, color: "#fff" }}>
          <label>
            Month (1-12):
            <input
              className="login-input"
              style={{ marginLeft: 8, marginRight: 16 }}
              type="number"
              value={month}
              onChange={e => setMonth(e.target.value)}
              min="1"
              max="12"
            />
          </label>
          <label>
            Year:
            <input
              className="login-input"
              style={{ marginLeft: 8, marginRight: 16 }}
              type="number"
              value={year}
              onChange={e => setYear(e.target.value)}
            />
          </label>
          <button className="login-btn" type="button">
            Get Monthly Report
          </button>
        </form>
        <form style={{ color: "#fff" }}>
          <label>
            Year:
            <input
              className="login-input"
              style={{ marginLeft: 8, marginRight: 16 }}
              type="number"
              value={yearly}
              onChange={e => setYearly(e.target.value)}
            />
          </label>
          <button className="login-btn" type="button">
            Get Yearly Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default Reports;