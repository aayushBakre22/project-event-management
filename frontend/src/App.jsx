import { Outlet, useNavigate } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const getCurrentUser = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const response = await axios.get("/api/v1/users/currentUser", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("ACCESS: ", response.data.data);
      setCurrentUser(response.data.data.user);
    } catch (error) {
      console.log("Access token error: ", error.response.data.error);
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.get("/api/v1/users/currentUser", {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        console.log("REFRESH: ", response.data.data);
        setCurrentUser(response.data.data.user);
      } catch (error) {
        console.log("Refresh token error: ", error.response.data.error);
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessToken");
        if (!sessionStorage.getItem("guest")) {
          navigate("/auth/login");
        }
      }
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const guest = sessionStorage.getItem("guest");

    if (!accessToken && !refreshToken && !guest) {
      navigate("/auth/login");
    }

    getCurrentUser();
  }, []);

  return (
    <div className="app-container">
      <Navbar currentUser={currentUser} />
      <div className="app-content">
        <Outlet context={currentUser} />
      </div>
    </div>
  );
}

export default App;
