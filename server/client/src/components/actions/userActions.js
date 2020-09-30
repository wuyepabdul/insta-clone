export const userActions = (data) => {
  return {
    type: "USER",
    payload: data,
  };
};

export const followAction = (data) => {
  return {
    type: "FOLLOW",
    payload: data,
  };
};

export const unfollowAction = (data) => {
  return {
    type: "UNFOLLOW",
    payload: data,
  };
};

export const clearAction = () => {
  return {
    type: "CLEAR",
  };
};

export const updatePhoto = (data) => {
  return {
    type: "UPDATE_PHOTO",
    payload: data,
  };
};
