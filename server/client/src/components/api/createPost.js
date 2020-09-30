import axios from "axios";

export const uploadFile = async (file) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const response = await axios.post("api/post/createPost", file, config);
  return response;
};

export const createPost = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const response = await axios.post("api/post/createPost", formData, config);
  return response;
};
