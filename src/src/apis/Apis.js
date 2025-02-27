import _Fetch from "./Service";

export const ADMIN_LOGIN = (body) => {
  return _Fetch("POST", "login/driver-login.php", body, {});
};
