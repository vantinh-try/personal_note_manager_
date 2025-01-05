import React from "react";
import { Link, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.css";
import "./SideBar.css";

const SideBar = () => {
  const location = useLocation();

  const closeFooterToggle = () => {
    const footerToggle = document.getElementById("nav-footer-toggle");
    if (footerToggle) {
      footerToggle.checked = false; // Đóng toggle menu
    }
  };

  return (
    <div id="nav-bar">
      <input type="checkbox" id="nav-toggle" />
      <div id="nav-header">
        <a id="nav-title" href="" target="_blank" rel="noopener noreferrer">
          <i className="fas fa-cogs"></i> My App
        </a>
        <label htmlFor="nav-toggle">
          <span id="nav-toggle-burger"></span>
        </label>
        <hr />
      </div>
      <div id="nav-content">
        {/* Task Link */}
        <Link to="/task">
          <div
            className={`nav-button ${
              location.pathname === "/task" ? "active" : ""
            }`}
          >
            <i className="fas fa-tasks"></i>
            <span>Task</span>
          </div>
        </Link>
        {/* Note Link */}
        <Link to="/note">
          <div
            className={`nav-button ${
              location.pathname === "/note" ? "active" : ""
            }`}
          >
            <i className="fas fa-sticky-note"></i>
            <span>Note</span>
          </div>
        </Link>
        {/* Diary Entry Link */}
        <Link to="/diary-entry">
          <div
            className={`nav-button ${
              location.pathname === "/diary-entry" ? "active" : ""
            }`}
          >
            <i className="fas fa-book"></i>
            <span>Diary Entry</span>
          </div>
        </Link>
        
        {/* Section for other links */}
        <div className="nav-links">
          {/* Additional links can go here */}
        </div>
        
        {/* Settings Link */}
        <div className="nav-footer">
          <Link to="/setting">
            <div
              className={`nav-button ${
                location.pathname === "/setting" ? "active" : ""
              }`}
              onClick={closeFooterToggle} // Đảm bảo đóng footer toggle khi nhấn vào Settings
            >
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
