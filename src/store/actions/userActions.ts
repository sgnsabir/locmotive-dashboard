// store/actions/userActions.ts
import { Dispatch } from "redux";
import { UserState } from "../reducers/userReducer";

export interface UserData {
  username: string;
  email: string;
  role: string;
}

// Example existing user
export interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  twoFactorEnabled?: boolean;
  phone?: string;
}

export const fetchUsers = () => (dispatch: Dispatch) => {
  dispatch({ type: "FETCH_USERS_REQUEST" });
  try {
    // Mock data
    const mockUsers: User[] = [
      {
        user_id: 1,
        username: "admin",
        email: "admin@example.com",
        role: "admin",
      },
      {
        user_id: 2,
        username: "john",
        email: "john@example.com",
        role: "operator",
      },
    ];
    // In real app: fetch from API
    dispatch({
      type: "FETCH_USERS_SUCCESS",
      payload: {
        users: mockUsers,
        total: mockUsers.length,
      },
    });
  } catch (err: any) {
    dispatch({ type: "FETCH_USERS_FAILURE", payload: err.message });
  }
};

export const createUser = (userData: UserData) => (dispatch: Dispatch) => {
  dispatch({ type: "CREATE_USER_REQUEST" });
  try {
    // Fake create
    const newUser: User = {
      user_id: Math.floor(Math.random() * 1000),
      username: userData.username,
      email: userData.email,
      role: userData.role,
    };
    dispatch({ type: "CREATE_USER_SUCCESS", payload: newUser });
  } catch (err: any) {
    dispatch({ type: "CREATE_USER_FAILURE", payload: err.message });
  }
};

export const deleteUser = (userId: number) => (dispatch: Dispatch) => {
  dispatch({ type: "DELETE_USER_REQUEST" });
  try {
    // Fake delete
    dispatch({ type: "DELETE_USER_SUCCESS", payload: userId });
  } catch (err: any) {
    dispatch({ type: "DELETE_USER_FAILURE", payload: err.message });
  }
};
