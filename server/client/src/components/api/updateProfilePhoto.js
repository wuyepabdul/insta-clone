import Axios from "axios";

export const updateProfilePhoto = async (photo) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const body = JSON.stringify({ photo: photo });

  const response = await Axios.put("/api/profile/updatePhoto", body, config);
  return response;
};
