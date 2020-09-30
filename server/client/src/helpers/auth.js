import { setCookie, deleteCookie } from "./cookies";
import {
  setLocalStorage,
  getLocalStorage,
  deleteLocalStorage,
} from "./localStorage";

export const setAuthentication = (token, user) => {
  setCookie("token", token);
  setLocalStorage("user", user);
};

export const isAuthenticated = () => {
  if (getLocalStorage("user")) {
    return getLocalStorage("user");
  } else {
    return false;
  }
};

export const logout = (next) => {
  deleteCookie("token");
  deleteLocalStorage("user");

  next();
};
