import axios from "axios";

export const unfollowUser = async (unfollowId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const body = JSON.stringify({ unfollowId });

  const response = await axios.put("/api/profile/unfollow", body, config);
  return response;
};
