import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import PrivateRoute from "./private";
import PublicRoute from "./public";

const NavRoutes = () => {
  const isLogin = useSelector((e) => e?.userAuth?.login);
  const jwt = useSelector((e) => e?.userAuth?.jwt);

  console.log(isLogin, "login status");

  console.log(jwt, "jst token");
  if (isLogin && jwt) {
    return <PrivateRoute />;
  } else {
    return <PublicRoute />;
  }
};

export default NavRoutes;
