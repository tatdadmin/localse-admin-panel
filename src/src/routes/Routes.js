import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./private";
import PublicRoute from "./public";
import Login from "../screens/Login/Login";
import Dashboard from "../screens/Dashboard/DashBoard";
import RegisterFreeOnboardingBusiness from "../screens/Agent Panel/RegisterFreeOnboardingBusiness";

const NavRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<PublicRoute Component={Login} />} />
        <Route path="/dashboard" element={<PrivateRoute Component={Dashboard} />} />
        <Route path="/RegisterFreeOnboardingBusiness" element={<PrivateRoute Component={RegisterFreeOnboardingBusiness} />}/>
      </Routes>
    </Router>
  );
};

export default NavRoutes;
