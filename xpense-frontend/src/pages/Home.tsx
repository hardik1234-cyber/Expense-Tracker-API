import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');
  return (
    <div className="home-container" style={{ textAlign: 'center', marginTop: 40 }}>
      <h1>Welcome to Xpense Tracker</h1>
      {isAuthenticated ? (
        <>
          <h2>Hello, {username}!</h2>
          <p>Quick Links:</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </>
      ) : (
        <>
          <p>Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to get started.</p>
        </>
      )}
    </div>
  );
};

export default Home; 