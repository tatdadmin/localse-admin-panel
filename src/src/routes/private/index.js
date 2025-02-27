import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../../screens/Login/Login";
import Dashboard from "../../screens/Dashboard/DashBoard";

const PrivateRoute = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/DashBoard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default PrivateRoute;
