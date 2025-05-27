import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ReportData {
  month?: string;
  Year?: string;
  total_expenses: number;
  category_breakdown: Record<string, number>;
}

const Reports: React.FC = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [monthlyReport, setMonthlyReport] = useState<ReportData | null>(null);
  const [yearlyReport, setYearlyReport] = useState<ReportData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '';
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return null;
  }

  const fetchMonthlyReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setMonthlyReport(null);
    try {
      const res = await fetch(`http://localhost:8000/get_monthly_expense?username=${username}&month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch monthly report');
      const data = await res.json();
      setMonthlyReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch monthly report');
    } finally {
      setLoading(false);
    }
  };

  const fetchYearlyReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setYearlyReport(null);
    try {
      const res = await fetch(`http://localhost:8000/get_yearly_expense?username=${username}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch yearly report');
      const data = await res.json();
      setYearlyReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch yearly report');
    } finally {
      setLoading(false);
    }
  };

  const renderPieChart = (data: Record<string, number>, title: string) => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    return (
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <Pie
          data={{
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: [
                  '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#B2FF66', '#FF66B2', '#66B2FF'
                ],
                borderWidth: 1,
              },
            ],
          }}
          options={{ plugins: { legend: { position: 'bottom' } }, responsive: true, maintainAspectRatio: false }}
        />
        <p style={{ textAlign: 'center', marginTop: 8 }}>{title}</p>
      </div>
    );
  };

  return (
    <div className="reports-container" style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Expense Reports</h2>
      <form onSubmit={fetchMonthlyReport} style={{ marginBottom: 16 }}>
        <label>Month: <input type="number" min="1" max="12" value={month} onChange={e => setMonth(e.target.value)} required /></label>
        <label>Year: <input type="number" min="2000" value={year} onChange={e => setYear(e.target.value)} required /></label>
        <button type="submit">Get Monthly Report</button>
      </form>
      <form onSubmit={fetchYearlyReport} style={{ marginBottom: 16 }}>
        <label>Year: <input type="number" min="2000" value={year} onChange={e => setYear(e.target.value)} required /></label>
        <button type="submit">Get Yearly Report</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {monthlyReport && (
        <div style={{ marginBottom: 24 }}>
          <h3>Monthly Report ({monthlyReport.month})</h3>
          <p>Total Expenses: {monthlyReport.total_expenses}</p>
          <h4>Category Breakdown:</h4>
          {renderPieChart(monthlyReport.category_breakdown, 'Monthly Category Breakdown')}
          <ul>
            {Object.entries(monthlyReport.category_breakdown).map(([cat, amt]) => (
              <li key={cat}>{cat}: {amt}</li>
            ))}
          </ul>
        </div>
      )}
      {yearlyReport && (
        <div>
          <h3>Yearly Report ({yearlyReport.Year})</h3>
          <p>Total Expenses: {yearlyReport.total_expenses}</p>
          <h4>Category Breakdown:</h4>
          {renderPieChart(yearlyReport.category_breakdown, 'Yearly Category Breakdown')}
          <ul>
            {Object.entries(yearlyReport.category_breakdown).map(([cat, amt]) => (
              <li key={cat}>{cat}: {amt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Reports; 