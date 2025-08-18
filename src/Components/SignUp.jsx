import { useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Signup({ onSignupSuccess }) {
  const [form, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Accounts",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.role) {
      toast.error("All fields are required", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/signup`,
        form
      );
      if (response.status === 201) {
        const { token, user } = response.data;
        if (!user || !user.id || !user.username || !user.role) {
          throw new Error("Invalid user data in API response");
        }
        toast.success("Signup successful! Redirecting...", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        onSignupSuccess({
          token,
          userId: user.id,
          role: user.role,
          username: user.username,
        });
      } else {
        toast.error("Unexpected response. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="form-box">
        <form className="form" onSubmit={handleSubmit}>
          <span className="title">Sign Up</span>
          <span className="subtitle">
            Create a free account with your email.
          </span>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="form-box">
            <input
              type="text"
              style={{ backgroundColor: "white" }}
              className="input"
              placeholder="Full Name"
              name="username"
              value={form.username}
              onChange={handleInput}
              required
            />
            <input
              type="email"
              style={{ backgroundColor: "white" }}
              className="input"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleInput}
              required
            />
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                style={{ backgroundColor: "white", paddingRight: "80px" }}
                className="input"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleInput}
                required
              />
              <button
                type="button"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "blue",
                  cursor: "pointer",
                }}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <select
              name="role"
              style={{ backgroundColor: "white" }}
              value={form.role}
              onChange={handleInput}
              className="input"
              required
            >
              <option value="Accounts">Accounts</option>
            </select>
          </div>
          <button
            type="submit"
            style={{ background: "linear-gradient(90deg, #6a11cb, #2575fc)" }}
          >
            Sign Up
          </button>
        </form>
        <div className="form-section">
          <p>
            Have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
