import axios from "axios";

export const fetchAllPosts = async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const response = await axios.get("/api/post/allPosts", config);
  return response;
};

export const fetchMyPosts = async () => {
  const config = {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const response = await axios.get("/api/post/myPosts", config);
  return response;
};

export const fetchSubscribedPosts = async () => {
  const config = {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  };

  const response = await axios.get("/api/post/subscribedPosts", config);
  return response;
};
