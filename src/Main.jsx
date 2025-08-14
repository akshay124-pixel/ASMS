import React, { useState, useCallback } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Components/Login";
import Signup from "./Components/SignUp";
import Navbar from "./Components/Navbar";
import App from "./App";
import EmployeeDashboard from "./Components/EmployeeDashboard";

const Main = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = useCallback(
    ({ token, userId, role, username }) => {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify({ username }));
      setIsAuthenticated(true);
      setUserRole(role);
      navigate(role === "Accounts" ? "/accounts" : "/");
    },
    [navigate]
  );

  const handleSignupSuccess = useCallback(
    ({ token, userId, role, username }) => {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify({ username }));
      setIsAuthenticated(true);
      setUserRole(role);
      navigate(role === "Accounts" ? "/accounts" : "/");
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole("");
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

  const showNavbar =
    location.pathname !== "/login" && location.pathname !== "/signup";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {showNavbar && (
        <Navbar
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          userRole={userRole}
        />
      )}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/signup"
          element={<Signup onSignupSuccess={handleSignupSuccess} />}
        />
        <Route path="/accounts" element={<App />} />
        <Route path="/employees" element={<EmployeeDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <footer
        className="footer-container"
        style={{
          padding: "10px",
          textAlign: "center",
          background: "linear-gradient(135deg, #2575fc, #6a11cb)",
          color: "white",
          marginTop: "auto",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.9rem" }}>
          © 2025 Accounts Management. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Main;
