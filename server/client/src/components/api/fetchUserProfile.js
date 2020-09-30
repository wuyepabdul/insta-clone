import axios from "axios";

export const fetchUserProfile = async (userId) => {
  try {
    const config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.get("/api/profile/" + userId, config);
    return response;
  } catch (error) {
    console.log(error);
  }
};
