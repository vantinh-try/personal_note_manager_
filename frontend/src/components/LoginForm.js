import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onToggle, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear previous error
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/login/",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Login successful:", response.data);

      if (response.data.access && response.data.refresh) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        onLoginSuccess(); // Notify App.js of successful login
        navigate("/setting"); // Navigate to Setting page
      } else {
        setErrorMessage("Token not received. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.error || "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
    
  };
  
  const handleRegisterClick = () => {
    navigate("/register");
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h1>Đăng kí</h1>
      {/* Hiển thị thông báo lỗi nếu có */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="form-group">
        <label>Tên đăng nhập</label>
        <input
          type="text"
          placeholder="Nhập tên tài khoản của ban"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {/* Nút gửi yêu cầu */}
      <button type="submit" className="btn" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <p>
        Don't have an account?{" "}
        <span className="toggle-link" onClick={handleRegisterClick}>
          Register here
        </span>
      </p>
    </form>
  );
};

export default LoginForm;
