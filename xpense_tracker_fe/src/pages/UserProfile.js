import React, { useEffect, useState } from 'react';
import { api, setAuthToken } from '../api/api';

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

  return (
    <div>
      <h2>User Profile</h2>
      {edit ? (
        <form onSubmit={handleSave}>
          <div>
            <label>Username: </label>
            <input name="username" value={form.username} onChange={handleChange} disabled />
          </div>
          <div>
            <label>Email: </label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      ) : (
        <>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <button onClick={handleEdit}>Edit Profile</button>
        </>
      )}
    </div>
  );
}

export default UserProfile;