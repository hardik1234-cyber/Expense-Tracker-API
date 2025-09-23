import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8000"; // Change if needed

export default function UserManagement() {
  const [userDetails, setUserDetails] = useState(null);
  const [updateEmail, setUpdateEmail] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Fetch user details on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      setError(""); setMessage("");
      try {
        const res = await fetch(`${API_URL}/user_details?username=${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error((await res.json()).detail || "Error fetching user");
        const data = await res.json();
        setUserDetails(data);
        setUpdateEmail(data.email);
      } catch (err) {
        setError(err.message);
        setUserDetails(null);
      }
    };
    if (username && token) fetchUserDetails();
  }, [username, token]);

  const updateUser = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      const res = await fetch(`${API_URL}/update_user_details`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email: updateEmail,
          password: updatePassword || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Update failed");
      const data = await res.json();
      setUserDetails(data);
      setMessage("User updated successfully!");
      setUpdatePassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteUser = async () => {
    setError(""); setMessage("");
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      const res = await fetch(`${API_URL}/delete_user?username=${username}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Delete failed");
      setUserDetails(null);
      setMessage("User deleted successfully! Please logout.");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!userDetails) {
    return (
      <div style={{ maxWidth: 400, margin: "auto", marginTop: 40 }}>
        <h2>User Management</h2>
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
        {message && <div style={{ color: "green", marginTop: 10 }}>{message}</div>}
        <div>Loading user data...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 40 }}>
      <h2>User Management</h2>
      <form onSubmit={updateUser} style={{ marginTop: 20 }}>
        <div>
          <label>Username: </label>
          <input value={userDetails.username} disabled />
        </div>
        <div>
          <label>Email: </label>
          <input
            value={updateEmail}
            onChange={e => setUpdateEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password: </label>
          <input
            type="password"
            value={updatePassword}
            onChange={e => setUpdatePassword(e.target.value)}
            placeholder="Leave blank to keep unchanged"
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Update</button>
        <button
          type="button"
          onClick={deleteUser}
          style={{ marginLeft: 10, color: "red" }}
        >
          Delete User
        </button>
      </form>
      {message && <div style={{ color: "green", marginTop: 10 }}>{message}</div>}
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
    </div>
  );
}