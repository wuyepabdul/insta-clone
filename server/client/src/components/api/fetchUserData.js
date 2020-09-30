import axios from "axios";

export const fetchUserData = async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const response = await axios.get("/api/user", config);
  return response;
};
