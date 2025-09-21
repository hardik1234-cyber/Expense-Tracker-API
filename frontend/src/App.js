import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import ReportDashboard from "./pages/ReportDashboard";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default path goes to Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reportdashboard" element={<ReportDashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
