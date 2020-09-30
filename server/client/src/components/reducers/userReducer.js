const initialState = {};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER":
      return action.payload;
    case "CLEAR":
      return null;
    case "FOLLOW":
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    case "UNFOLLOW":
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    case "UPDATE_PHOTO":
      return {
        ...state,
        photo: action.payload,
      };
    default:
      return state;
  }
};
