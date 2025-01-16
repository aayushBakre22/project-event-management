/* eslint-disable react/prop-types */
import { useState } from "react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router";

const Navbar = ({ currentUser }) => {
  const [navList, setNavList] = useState(false);
  const [showUserButtons, setShowUserButtons] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("guest");
    localStorage.removeItem("refreshToken");
    navigate("/auth/login");
  };

  return (
    <div className="navbar container">
      <a href="/">
        <h1>PlanIt</h1>
      </a>

      <div
        className={`hamburger-menu ${navList ? "active" : ""}`}
        onClick={() => {
          setNavList((prev) => !prev);
          setShowUserButtons(false);
        }}
      >
        <div></div>
      </div>
      <ul className={`nav-list ${navList ? "show" : ""}`}>
        <li>
          <NavLink
            to={"/"}
            onClick={() => {
              setNavList(false);
            }}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Events
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/createEvent"}
            onClick={() => {
              setNavList(false);
            }}
          >
            New Event
          </NavLink>
        </li>
      </ul>

      <div className="user-buttons-container">
        <img
          src={currentUser ? currentUser.avatar : "/assets/default-avatar.jpg"}
          alt=""
          className="profile-icon"
          onClick={() => {
            if (!currentUser) {
              sessionStorage.removeItem("guest");
              navigate("/auth/login");
            }
            setShowUserButtons((prev) => !prev);
            setNavList(false);
          }}
        />
        {currentUser && (
          <div className={`user-buttons ${showUserButtons ? "active" : ""}`}>
            <p>Hi {currentUser.name.split(" ")[0]}</p>
            <button onClick={handleLogout}>LOGOUT</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
