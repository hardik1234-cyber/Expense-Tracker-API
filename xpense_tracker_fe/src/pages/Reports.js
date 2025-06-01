import React, { useState } from 'react';
import { api, setAuthToken } from '../api/api';

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
    <div>
      <h2>Reports</h2>
      <form onSubmit={fetchMonthly} style={{ marginBottom: 20 }}>
        <label>Month (1-12): </label>
        <input
          type="number"
          min="1"
          max="12"
          value={month}
          onChange={e => setMonth(e.target.value)}
          required
        />
        <label>Year: </label>
        <input
          type="number"
          min="2000"
          value={year}
          onChange={e => setYear(e.target.value)}
          required
        />
        <button type="submit">Get Monthly Report</button>
      </form>
      {monthly && (
        <div>
          <h3>Monthly Report for {monthly.month}</h3>
          <p>Total Expenses: {monthly.total_expenses}</p>
          <h4>Category Breakdown:</h4>
          <ul>
            {Object.entries(monthly.category_breakdown).map(([cat, amt]) => (
              <li key={cat}>{cat}: {amt}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={fetchYearly} style={{ marginTop: 40 }}>
        <label>Year: </label>
        <input
          type="number"
          min="2000"
          value={year}
          onChange={e => setYear(e.target.value)}
          required
        />
        <button type="submit">Get Yearly Report</button>
      </form>
      {yearly && (
        <div>
          <h3>Yearly Report for {yearly.Year || yearly.year}</h3>
          <p>Total Expenses: {yearly.total_expenses}</p>
          <h4>Category Breakdown:</h4>
          <ul>
            {Object.entries(yearly.category_breakdown).map(([cat, amt]) => (
              <li key={cat}>{cat}: {amt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Reports;