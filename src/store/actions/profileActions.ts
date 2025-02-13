import { Dispatch } from "redux";

export const updateProfile =
  (profileData: {
    username: string;
    email: string;
    avatar: string;
    twoFactorEnabled: boolean;
    phone: string;
  }) =>
  (dispatch: Dispatch) => {
    // Simulate an API call; in production, replace with actual HTTP call
    dispatch({ type: "UPDATE_PROFILE_SUCCESS", payload: profileData });
  };
