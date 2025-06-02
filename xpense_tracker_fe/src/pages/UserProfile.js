import React, { useEffect, useState } from 'react';
import { api, setAuthToken } from '../api/api';
import './Login.css';


function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ username: '', email: '' });
  const username = localStorage.getItem('username');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);
    if (username) {
      api.get('/user_details', { params: { username } })
        .then(res => {
          setProfile(res.data);
          setForm({ username: res.data.username, email: res.data.email });
        })
        .catch(() => setProfile(null));
    }
  }, [username]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEdit(true);

  const handleCancel = () => {
    setEdit(false);
    setForm({ username: profile.username, email: profile.email });
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      await api.put('/update_user_details', { ...form, username }); // Adjust endpoint/params as per your backend
      setProfile({ ...profile, ...form });
      setEdit(false);
      alert('Profile updated!');
    } catch {
      alert('Update failed');
    }
  };

  if (!profile) return <div>Loading profile...</div>;

// ...existing code...
return (
  <div className="login-bg">
    <div className="login-card" style={{ maxWidth: 400 }}>
      <h2 className="login-title">User Profile</h2>
      <div style={{ color: "#fff", marginTop: 24 }}>
        {edit ? (
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: 18 }}>
              <strong>Username:</strong>
              <input
                className="login-input"
                name="username"
                value={form.username}
                onChange={handleChange}
                style={{ marginLeft: 8 }}
                required
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <strong>Email:</strong>
              <input
                className="login-input"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={{ marginLeft: 8 }}
                required
              />
            </div>
            <button className="login-btn" type="submit">Save</button>
            <button className="login-btn" type="button" style={{ marginLeft: 8, background: "#888" }} onClick={handleCancel}>Cancel</button>
          </form>
        ) : (
          <>
            <div style={{ marginBottom: 18 }}>
              <strong>Username:</strong> {profile.username}
            </div>
            <div style={{ marginBottom: 18 }}>
              <strong>Email:</strong> {profile.email}
            </div>
            <button className="login-btn" onClick={handleEdit}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  </div>
);
// ...existing code...
}

export default UserProfile;