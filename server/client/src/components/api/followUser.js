import axios from "axios";

export const followUser = async (followId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };

  const body = JSON.stringify({ followId });

  const response = await axios.put("/api/profile/follow", body, config);
  return response;
};
