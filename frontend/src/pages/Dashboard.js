import React from "react";

function Dashboard() {
  const token = localStorage.getItem("token");

  return (
    <div>
      <h2>Dashboard</h2>
      {token ? <p>Welcome! You are logged in ✅</p> : <p>Please login</p>}
    </div>
  );
}

export default Dashboard;
