import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ Component }) => {
  const isLogin = useSelector((state) => state.userAuth.login);
  const jwt = useSelector((state) => state.userAuth.jwt);

  return jwt && isLogin ? <Component /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
