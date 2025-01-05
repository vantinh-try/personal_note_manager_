import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import SideBar from "./components/SideBar";
import Task from "./components/Task";
import Note from "./components/Note";
import DiaryEntry from "./components/DiaryEntry";
import Setting from "./components/Setting";
import "./global.css";
import "./components/form.css";
import "./components/SideBar.css";
import "./components/Task.css";
import "./components/Note.css";
import "./components/DiaryEntry.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
    toast.success("Đăng xuất thành công!", {
      autoClose: 3000,
      onClose: () => {
        window.location.href = "/login"; // Điều hướng về login ngay lập tức
      },
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/verify-token/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setIsLoggedIn(true);
        })
        .catch(() => {
          handleLogout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="loading">Đang kiểm tra trạng thái đăng nhập...</div>;
  }

  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <div style={{ display: "flex", height: "100vh" }}>
          {isLoggedIn && <SideBar />}

          <div style={{ marginLeft: isLoggedIn ? "var(--navbar-width)" : "0", padding: "20px", flex: 1 }}>
            <Routes>
              <Route
                path="/login"
                element={
                  !isLoggedIn ? (
                    <div className="wrapper">
                      <div className="form-container">
                        <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
                      </div>
                    </div>
                  ) : (
                    <Navigate to="/task" />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  <div className="wrapper">
                    <div className="form-container">
                      <RegisterForm onRegisterSuccess={() => setIsLoggedIn(true)} />
                    </div>
                  </div>
                }
              />
              <Route
                path="/task"
                element={isLoggedIn ? <Task /> : <Navigate to="/login" />}
              />
              <Route
                path="/note"
                element={isLoggedIn ? <Note /> : <Navigate to="/login" />}
              />
              <Route
                path="/diary-entry"
                element={isLoggedIn ? <DiaryEntry /> : <Navigate to="/login" />}
              />
              <Route
                path="/setting"
                element={isLoggedIn ? <Setting onLogout={handleLogout} /> : <Navigate to="/login" />}
              />
              <Route
                path="/"
                element={
                  isLoggedIn ? <Navigate to="/setting" /> : <Navigate to="/login" />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
