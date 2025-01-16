import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegister } from "../../hooks/useRegister";

const LoginForm = () => {
  const { login, message, loading } = useRegister();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
    if (message.success) {
      setFormData({
        username: "",
        password: "",
      });
      navigate("/");
    }
  };

  const guestLogin = (e) => {
    e.preventDefault();
    sessionStorage.setItem("guest", "guestLogin");
    navigate("/");
  };

  return (
    <>
      <div className="login-form-container">
        <div>
          <h1>Sign in</h1>
          <h2>Enter your details to login to your account</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-div">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-div">
            <label htmlFor="">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            Login
          </button>
          <button
            onClick={(e) => {
              guestLogin(e);
            }}
          >
            Guest Login
          </button>
          {message.data && <p>{message.data}</p>}
        </form>
      </div>
      <div className=" alternate-container">
        <p>Dont have an account?</p>
        <Link to={"/auth/signup"}>Sign up</Link>
      </div>
    </>
  );
};

export default LoginForm;
