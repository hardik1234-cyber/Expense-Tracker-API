import React, { useState } from 'react';
import { api } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reuse the login styles

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/signup', { username, email, password });
      alert('Registered! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">REGISTER</h2>
        <form onSubmit={handleRegister}>
          <input
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            className="login-input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="login-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button className="login-btn" type="submit">REGISTER</button>
        </form>
        <div className="login-links">
          <Link to="/login">LOGIN</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;