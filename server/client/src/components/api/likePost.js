import axios from "axios";

export const likePost = async (id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const body = JSON.stringify({ postId: id });
  const response = await axios.put("/api/post/like", body, config);
  return response;
};
