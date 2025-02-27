import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ Component }) => {
  const isLogin = useSelector((state) => state.userAuth.login);
  const jwt = useSelector((state) => state.userAuth.jwt);

  return jwt && isLogin ? <Navigate to="/dashboard" replace /> : <Component />;
};

export default PublicRoute;
