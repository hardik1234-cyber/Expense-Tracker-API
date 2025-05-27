import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '';
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchExpenses();
    // eslint-disable-next-line
  }, []);

  const fetchExpenses = async () => {
    setError('');
    try {
      const res = await fetch(`http://localhost:8000/get_expense?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json();
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expenses');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:8000/add_expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, amount: Number(amount), category, description }),
      });
      if (!res.ok) throw new Error('Failed to add expense');
      setAmount('');
      setCategory('');
      setDescription('');
      setSuccess('Expense added!');
      fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'Failed to add expense');
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
    setEditDescription(expense.description);
  };

  const handleUpdate = async (id: string) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:8000/update_expense_by_id?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(editAmount), category: editCategory, description: editDescription }),
      });
      if (!res.ok) throw new Error('Failed to update expense');
      setEditingId(null);
      setSuccess('Expense updated!');
      fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'Failed to update expense');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this expense?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:8000/delete_expense_by_id?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete expense');
      setSuccess('Expense deleted!');
      fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'Failed to delete expense');
    }
  };

  return (
    <div className="expenses-container">
      <h2>Expenses</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 24 }}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit">Add Expense</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>
                {editingId === exp.id ? (
                  <input
                    type="number"
                    value={editAmount}
                    onChange={e => setEditAmount(e.target.value)}
                  />
                ) : (
                  exp.amount
                )}
              </td>
              <td>
                {editingId === exp.id ? (
                  <input
                    type="text"
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                  />
                ) : (
                  exp.category
                )}
              </td>
              <td>
                {editingId === exp.id ? (
                  <input
                    type="text"
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                  />
                ) : (
                  exp.description
                )}
              </td>
              <td>{new Date(exp.date).toLocaleString()}</td>
              <td>
                {editingId === exp.id ? (
                  <>
                    <button onClick={() => handleUpdate(exp.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(exp)}>Edit</button>
                    <button onClick={() => handleDelete(exp.id)} style={{ color: 'red' }}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expenses; 