import axios from "axios";

export const deletePost = async (postId) => {
  const config = {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  };

  const response = await axios.delete(`api/post/deletePost/${postId}`, config);
  return response;
};
