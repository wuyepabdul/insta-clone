import Axios from "axios";

export const uploadPhoto = async (image) => {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "insta-clone");
  data.append("cloud_name", "dulswuyep");

  const response = await Axios.post(
    "https://api.cloudinary.com/v1_1/dulswuyep/image/upload",
    data
  );
  return response;
};
