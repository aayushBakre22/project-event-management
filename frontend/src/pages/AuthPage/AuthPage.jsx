import { useEffect } from "react";
import LoginForm from "../../components/Login/LoginForm";
import SignupForm from "../../components/Signup/SignupForm";
import "./AuthPage.css";

const AuthPage = ({ type }) => {
  useEffect(() => {
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
  }, []);

  return (
    <>
      <div className="auth-page">
        <div className="auth-bg"></div>
        <div style={{ padding: "10px" }} className="auth-page-content">
          {type === "signup" ? <SignupForm /> : <LoginForm />}
        </div>
      </div>
    </>
  );
};

export default AuthPage;
