import React, { useState } from 'react';
import { api, setAuthToken } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('username', username);
      form.append('password', password);
      const res = await api.post('/login', form);
      setAuthToken(res.data.access_token);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('username', username);
      navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">LOGIN</h2>
        <form onSubmit={handleLogin}>
          <input
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            className="login-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button className="login-btn" type="submit">SUBMIT</button>
        </form>
        <div className="login-links">
          <Link to="/register">REGISTER</Link>
          <span> | </span>
          <a href="#">FORGOT PASSWORD</a>
        </div>
      </div>
    </div>
  );
}

export default Login;