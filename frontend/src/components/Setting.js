import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Setting.css";

const Setting = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [passwordModal, setPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUserName("");
    setEmail("");
    setAvatar(null);
    toast.success("Đăng xuất thành công!", {
      autoClose: 1000,
      onClose: () => {
        window.location.href = "/login"; // Điều hướng trực tiếp thay vì sử dụng navigate
      },
    });
  }, []);

  // Lấy thông tin người dùng khi tải trang
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    // Nếu không có token, chuyển hướng về login
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/accounts/profile/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.username);
          setEmail(data.email);
        } else {
          handleLogout(); // Token không hợp lệ thì đăng xuất
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        handleLogout(); // Có lỗi thì đăng xuất
      }
    };

    fetchUserProfile();
  }, [navigate, handleLogout]);

  // Thay đổi avatar
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleChangePassword = async () => {
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu mới và xác nhận không khớp.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/change-password/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      if (response.ok) {
        toast.success("Mật khẩu đã được thay đổi thành công!");
        setPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await response.json();
        setPasswordError(data.error || "Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      setPasswordError("Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại!");
    }
  };

  return (
    <div className="setting-container">
      <ToastContainer />
      <h1>Cài đặt tài khoản</h1>

      <div className="profile-section">
        <div className="avatar-container">
          <img
            src={avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="avatar"
            onClick={() => document.getElementById("avatar-upload").click()}
          />
          <input
            type="file"
            accept="image/*"
            id="avatar-upload"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="user-info">
          <h2>{userName}</h2>
          <p>{email}</p>
        </div>
      </div>

      <div className="setting-sections">
        <div className="setting-section">
          <button onClick={() => setPasswordModal(true)} className="btn-setting">
            Thay đổi mật khẩu
          </button>
        </div>
        <div className="setting-section">
          <button onClick={handleLogout} className="btn-setting" disabled={isLoading}>
            {isLoading ? "Đang đăng xuất..." : "Đăng xuất"}
          </button>
        </div>
      </div>

      {/* Modal thay đổi mật khẩu */}
      {passwordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Thay đổi mật khẩu</h3>
            <label htmlFor="oldPassword">Mật khẩu cũ:</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <label htmlFor="newPassword">Mật khẩu mới:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <div className="modal-actions">
              <button onClick={handleChangePassword} className="btn">
                Xác nhận
              </button>
              <button
                onClick={() => setPasswordModal(false)}
                className="btn-cancel"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
