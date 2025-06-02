import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const logoUrl = "https://ui-avatars.com/api/?name=U&background=0D8ABC&color=fff"; // Replace with your logo if needed

function ProfileMenu({ username, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="login-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          color: '#fff',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
          padding: 0
        }}
        onClick={() => setOpen(!open)}
      >
        <img
          src={logoUrl}
          alt="profile"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            marginRight: 10,
            border: '2px solid #2196f3',
            background: '#222'
          }}
        />
        {username}
        <span style={{ marginLeft: 8, fontSize: 20 }}>▼</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 50,
            background: '#23233a',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            minWidth: 150,
            zIndex: 10,
            padding: 8
          }}
        >
          <Link to="/profile">
            <button className="login-btn" style={{ width: '100%', marginBottom: 8 }}>Profile</button>
          </Link>
          <button className="login-btn" style={{ width: '100%', background: '#e74c3c' }} onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;