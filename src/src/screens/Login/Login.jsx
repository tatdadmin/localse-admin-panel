import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserAuthStates } from "../../redux/slices/userAuthSlice";
import "./Login.css";
import { ADMIN_LOGIN } from "../../apis/Apis";

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
    console.log("Login form submitted");

    try {
      const res = await ADMIN_LOGIN(credentials);
      console.log("API Response:", res);
// return false
      console.log(res, "]]]]]]]]");

      if (res?.status_code === 200) {
        console.log("Status code is 200");

        if (res?.jwt) {
          console.log("JWT exists, setting auth states");

          dispatch(setUserAuthStates({ key: "jwt", value: res?.jwt }));
          console.log("JWT set in state:", res?.jwt);

          dispatch(
            setUserAuthStates({
              key: "refreshToken",
              value: res?.refresh_token,
            })
          );
          dispatch(
            setUserAuthStates({
              key: "userAllData",
              value: res?.admin_details,
            })
          );
          
          console.log("Refresh token set in state:", res?.refresh_token);

          dispatch(setUserAuthStates({ key: "login", value: true }));
          console.log("User login state set to true");

          navigate("/dashboard");
          setTimeout(() => {
            alert(res?.message);
          }, 100);

          console.log("Navigating to /dashboard");
        } else {
          console.log("JWT not found in response");
          alert("Invalid credentials, please try again.");
        }
      } else {
        console.log("Error: Status code is not 200", res?.status_code);
        alert("Error logging in. Please try again.");
      }
    } catch (error) {
      console.log("Error during login process:", error);
      alert(error?.message || "Error logging in. Please try again.");
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
      </form>
    </div>
  );
};

export default Login;
