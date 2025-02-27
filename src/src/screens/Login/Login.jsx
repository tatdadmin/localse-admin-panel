import React, { useState } from "react";
import "./Login.css"; // Importing the CSS file
import { Link, useNavigate } from "react-router-dom";
import { ADMIN_LOGIN } from "../../apis/Apis";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserAuthStates } from "../../redux/slices/userAuthSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    mobile_number: "",
    pin: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", credentials);

    try {
      const res = await ADMIN_LOGIN(credentials); // Call the API
      console.log(res, "API Response");

      // return false;

      if (res?.status_code == 200) {
        if (res?.jwt && res?.refresh_token) {
          dispatch(
            setUserAuthStates({
              key: "jwt",
              value: res?.jwt,
            })
          );
        }
        dispatch(
          setUserAuthStates({
            key: "refreshToken",
            value: res?.refresh_token,
          })
        );
        dispatch(
          setUserAuthStates({
            key: "login",
            value: true,
          })
        );
        alert(res?.message);

        navigate("/dashboard");
      } else {
        console.log("Login failed:", res);
        alert("Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error?.message);
    }
  };
  return (
    <div className="login-container">
      <h1 style={{ color: "red", margin: 20 }}>LocalSe</h1>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-box">
          <input
            type="text"
            name="mobile_number"
            placeholder="Username"
            value={credentials.mobile_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            name="pin"
            placeholder="Password"
            value={credentials.pin}
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
