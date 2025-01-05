import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ onToggle }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // General error message
  const [fieldErrors, setFieldErrors] = useState({}); // Field-specific error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setFieldErrors({});

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/register/",
        { username, email, password, confirm_password: confirmPassword },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Registration successful:", response.data);

      if (response.data.access && response.data.refresh) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        navigate("/setting"); // Navigate to Setting page after registration
      } else {
        setErrorMessage("Token not received. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      const errors = error.response?.data || {};
      setFieldErrors(errors);
      setErrorMessage(
        errors?.non_field_errors?.[0] || "Registration failed. Please check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };

    
  
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Đăng ký</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="form-group">
        <label>Tên đăng nhập</label>
        <input
          type="text"
          placeholder=""
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {fieldErrors.username && <p className="field-error">{fieldErrors.username[0]}</p>}
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {fieldErrors.email && <p className="field-error">{fieldErrors.email[0]}</p>}
      </div>
      <div className="form-group">
        <label>Mật khẩu</label>
        <input
          type="password"
          placeholder=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {fieldErrors.password && <p className="field-error">{fieldErrors.password[0]}</p>}
      </div>
      <div className="form-group">
        <label>Nhập lại mật khẩu</label>
        <input
          type="password"
          placeholder=""
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn" disabled={loading}>
        {loading ? "Registering..." : "Đăng kí"}
      </button>
      <p>
        Bạn đã có tài khoản?{" "}
        <span className="toggle-link" onClick={handleLoginClick}>
          Đăng nhập tại đây
        </span>
      </p>
    </form>
  );
};

export default RegisterForm;
