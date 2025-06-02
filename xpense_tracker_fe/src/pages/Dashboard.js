import React, { useEffect, useState } from 'react';
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

    <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto', paddingTop: 0 }}>
      <div className="dashboard-actions">
        <button className="login-btn" onClick={handleLogout}>Logout</button>
        <Link to="/profile"><button className="login-btn">Profile</button></Link>
        <Link to="/reports"><button className="login-btn">Reports</button></Link>
      </div>
    </div>

    <div className="dashboard-flex" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ flex: 1, minWidth: 320, marginRight: 32 }}>
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
        {/* Remove the duplicate Expenses heading here */}
        <div style={{ maxWidth: 400, margin: '32px auto 0 auto' }}>
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
      <div className="dashboard-chart" style={{ flex: '0 0 340px', maxWidth: 400, margin: '0 auto' }}>
        <Pie data={chartData} />
      </div>
    </div>
  </div>
);
}

export default Dashboard;