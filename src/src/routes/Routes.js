import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../screens/Login/Login";
import DashBoard from "../screens/Dashboard/DashBoard";

const NavRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/DashBoard" element={<DashBoard />} />
      </Routes>
    </Router>
  );
};

export default NavRoutes;
