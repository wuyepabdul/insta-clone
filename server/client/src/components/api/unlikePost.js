import axios from "axios";

export const unlikePost = async (id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const body = JSON.stringify({ postId: id });
  const response = await axios.put("/api/post/unlike", body, config);
  console.log(response);
  return response;
};
