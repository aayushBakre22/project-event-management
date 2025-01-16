import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegister } from "../../hooks/useRegister";

const SignupForm = () => {
  const { signup, message, loading } = useRegister();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    avatar: "",
  });
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
    if (message.success) {
      setFormData({
        username: "",
        name: "",
        password: "",
      });
      setAvatar(null);
      navigate("/");
    }
  };

  return (
    <>
      <div className="login-form-container">
        <div>
          <h1>Sign up</h1>
          <h2>Fill the form below to create your account</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-div">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
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
          <div className="form-div">
            <label htmlFor="avatar-input">Avatar</label>
            <input
              accept="image/*"
              type="file"
              id="avatar-input"
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  setAvatar(URL.createObjectURL(files[0]));
                  setFormData((prev) => {
                    return { ...prev, avatar: files[0] };
                  });
                }
              }}
            />
            {avatar && (
              <img className="avatar-preview" src={avatar} alt="your avatar" />
            )}
          </div>

          <button type="submit" disabled={loading}>
            Register
          </button>

          {message.data && <p>{message.data}</p>}
        </form>
      </div>
      <div className=" alternate-container">
        <p>Already have an account?</p>
        <Link to={"/auth/login"}>Login</Link>
      </div>
    </>
  );
};

export default SignupForm;
