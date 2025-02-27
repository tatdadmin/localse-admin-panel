import React, { useState } from "react";
import "./Login.css"; // Importing the CSS file
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", credentials);

    console.log(e,"------");

    
    
    // window.location.href = "/dashboard";

    navigate("/dashboard"); // Navigate to Dashboard
  };

  return (
    <div className="login-container">
      <h1 style={{ color: "red", margin: 20 }}>LocalSe</h1>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-box">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
        {/* <Link  to={"/Dashboard"} >
        Login
        </Link> */}
      </form>
    </div>
  );
};

export default Login;
