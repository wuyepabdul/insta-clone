import axios from "axios";

export const signup = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post("/api/user/signup", data, config);
  return response;
};

export const signin = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const response = await axios.post("/api/user/signin", data, config);
  return response;
};

export const resetPassword = async (email) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post("/api/user/resetPassword", email, config);
  return response;
};

export const newPassword = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post("/api/user/newPassword", data, config);
  return response;
};
