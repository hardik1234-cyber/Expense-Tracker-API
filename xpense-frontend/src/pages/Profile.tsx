import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Fetch user details
    fetch('http://localhost:8000/user_details?username=' + localStorage.getItem('username'), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user details');
        return res.json();
      })
      .then(data => {
        setUsername(data.username);
        setEmail(data.email);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/update_user_details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, password: password || undefined }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Update failed');
      }
      setSuccess('Profile updated!');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/delete_user?username=' + username, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Delete failed');
      }
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="New Password (leave blank to keep current)"
        />
        <button type="submit">Update Profile</button>
      </form>
      <button style={{ marginTop: 16, color: 'red' }} onClick={handleDelete}>Delete Account</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default Profile; 