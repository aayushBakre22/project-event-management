import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

export const useRegister = () => {
  const [message, setMessage] = useState({
    success: false,
    data: "",
  });
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const signup = async (data) => {
    setLoading(true);
    setMessage({
      success: false,
      data: "",
    });
    try {
      const response = await axios.post("/api/v1/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      sessionStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      setMessage({
        success: true,
        data: response.data.message,
      });
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error.response.data);
      setMessage((prev) => {
        return { ...prev, data: error.response.data.error };
      });
      setLoading(false);
    }
  };

  const login = async (data) => {
    setLoading(true);
    setMessage({
      success: false,
      data: "",
    });
    try {
      const response = await axios.post("/api/v1/users/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      sessionStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      setMessage({
        success: true,
        data: response.data.message,
      });
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error.response.data);
      setMessage((prev) => {
        return { ...prev, data: error.response.data.error };
      });
      setLoading(false);
    }
  };

  //   const edit = async (data) => {
  //     setLoading(true);
  //     setMessage(null);
  //     try {
  //       const response = await axios.patch(`${backendUrl}/api/v1/users/editUser`, data, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //         withCredentials: true,
  //       });
  //       console.log(response.data);
  //       dispatch({ type: "LOGIN", payload: response.data.data });
  //       setLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //       setMessage(error.response.data.error);
  //       setMessage(error.response.data.error);
  //       setLoading(false);
  //     }
  //   };

  return {
    signup,
    login,
    // edit,
    loading,
    message,
  };
};
