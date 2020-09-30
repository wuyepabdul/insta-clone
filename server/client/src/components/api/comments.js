import axios from "axios";

export const addComment = async (text, postId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const body = JSON.stringify({ text, postId });

  const response = await axios.put("/api/post/comment", body, config);
  return response;
};
