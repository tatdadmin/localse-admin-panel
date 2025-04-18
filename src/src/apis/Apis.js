// import axios from "axios";
import _Fetch from "./Service";

export const ADMIN_LOGIN = (body) => {
  console.log("ADMIN_LOGIN Called with Credentials:", body);
  return _Fetch("POST", "admin_panel/login", body, {});
};

export const ADD_NOTIFICATION = (body) => {
  console.log("ADD_NOTIFICATION Called with BODY:", body);
  // return false;
  return _Fetch("POST", "admin_panel/create-notification", body, {});
};

export const ADD_NOTICE = (body) => {
  console.log("ADD_NOTICE Called with BODY:", body);
  // return false;
  return _Fetch("POST", "admin_panel/create-notice", body, {});
};

export const GET_ALL_NOTICE = (body) => {
  console.log("GET_ALL_NOTICE Called with BODY:", body);
  // return false;
  return _Fetch("GET", "admin_panel/get-notice", body, {});
};



export const DELETE_NOTICE = (body) => {
  console.log("GET_ALL_NOTICE Called with BODY:", body);
  // return false;
  return _Fetch("POST", "admin_panel/delete-notice",body, {});
};

// http://13.203.38.122:5001/api/admin_panel/get-notice
