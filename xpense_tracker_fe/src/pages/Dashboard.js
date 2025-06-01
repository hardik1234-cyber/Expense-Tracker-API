import React, { useEffect, useState } from 'react';
import { api, setAuthToken } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: '', amount: '', description: '', date: '' });
  const [editId, setEditId] = useState(null);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

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
      await api.delete(`/delete_expense_by_id/${id}`);
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch {
      alert('Failed to delete expense');
    }
  };

  return (
    <div>
      <h2>Expenses</h2>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/profile">
        <button>Profile</button>
      </Link>

      <Link to="/reports">
        <button>Reports</button>
      </Link>

      <div style={{ maxWidth: 400, margin: '20px auto' }}>
        <Pie data={chartData} />
      </div>


       <form onSubmit={handleSubmit} style={{ marginTop: 20 }}></form>

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="date"
          type="date"
          placeholder="Date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? 'Update' : 'Add'} Expense</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ category: '', amount: '', description: '', date: '' }); }}>Cancel</button>}
      </form>

      <ul>
        {expenses.map(exp => (
          <li key={exp.id}>
            {exp.category}: {exp.amount} ({exp.description}) [{exp.date}]
            <button onClick={() => handleEdit(exp)}>Edit</button>
            <button onClick={() => handleDelete(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;