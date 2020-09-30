import axios from "axios";

export const searchResult = async (query) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ query });
  const response = await axios.post("/api/profile/searchResult", body, config);
  return response;
};
