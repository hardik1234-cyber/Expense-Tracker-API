import React, { useEffect, useState, useRef} from 'react';
import { api, setAuthToken } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import './Dashboard.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: '', amount: '', description: '', date: '' });
  const [editId, setEditId] = useState(null);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch expenses
  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);
    if (username) {
      api.get('/get_expense', { params: { username } })
        .then(res => setExpenses(res.data))
        .catch(() => {});
    }
  }, [username]);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update expense
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/update_expense/${editId}`, { ...form, username });
        setExpenses(expenses.map(exp => exp.id === editId ? { ...exp, ...form } : exp));
        setEditId(null);
      } else {
        const res = await api.post('/add_expense', { ...form, username });
        setExpenses([...expenses, res.data]);
      }
      setForm({ category: '', amount: '', description: '', date: '' });
      setShowForm(false);
    } catch {
      alert('Failed to save expense');
    }
  };

  // Edit expense
  const handleEdit = exp => {
    setEditId(exp.id);
    setForm({
      category: exp.category,
      amount: exp.amount,
      description: exp.description,
      date: exp.date,
    });
  };

  // Delete expense
  const handleDelete = async id => {
    try {
      await api.delete('/delete_expense_by_id', { params: { id } });
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch {
      alert('Failed to delete expense');
    }
  };

  return (
    <div className="login-bg">
      {/* Top centered Expenses heading */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 32,
          marginBottom: 0,
        }}
      >
        <h2 className="login-title" style={{ margin: 0, textAlign: 'center' }}>Expenses</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 1200, margin: '0 auto' }}>
        <div ref={menuRef} style={{ position: 'relative', margin: '16px 0' }}>
          <button
            className="login-btn"
            style={{ minWidth: 140, fontWeight: 600 }}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {username} &#9662;
          </button>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                background: '#23233a',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                minWidth: 160,
                zIndex: 10,
                padding: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <button className="login-btn" style={{ width: '100%' }} onClick={handleLogout}>Logout</button>
              <Link to="/profile"><button className="login-btn" style={{ width: '100%' }}>Profile</button></Link>
              <Link to="/reports"><button className="login-btn" style={{ width: '100%' }}>Reports</button></Link>
            </div>
          )}
        </div>
      </div>
      <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '40px',
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    flexWrap: 'wrap',
  }}
>
  {/* Table and Form */}
  <div style={{ flex: 1, minWidth: 500, maxWidth: 700 }}>
    <div className="dashboard-table-wrapper">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>{exp.category}</td>
              <td>{exp.amount}</td>
              <td>{exp.description}</td>
              <td>{exp.date}</td>
              <td>
                <button className="login-btn edit-btn" onClick={() => handleEdit(exp)}>Edit</button>
                <button className="login-btn delete-btn" onClick={() => handleDelete(exp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={{ marginTop: 24 }}>
      {!showForm ? (
        <button
          className="login-btn"
          style={{ width: '100%', margin: '32px 0' }}
          onClick={() => setShowForm(true)}
        >
          Add Expense
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="dashboard-form">
          <input
            className="login-input"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
          <input
            className="login-input"
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <input
            className="login-input"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            className="login-input"
            name="date"
            type="date"
            placeholder="Date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <button className="login-btn" type="submit">{editId ? 'Update' : 'Add'} Expense</button>
          <button
            className="login-btn"
            type="button"
            style={{ background: '#888', color: '#fff', marginLeft: 8 }}
            onClick={() => {
              setShowForm(false);
              setEditId(null);
              setForm({ category: '', amount: '', description: '', date: '' });
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  </div>

  {/* Chart to the right */}
<div
  className="dashboard-chart"
  style={{
    minWidth: 300,
    maxWidth: 400,
    flex: 1,
    alignSelf: 'flex-start',
  }}
>
  <Pie data={chartData} />
</div>
</div>
    </div>
  );
}

export default Dashboard;