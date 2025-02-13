// src/store/reducers/userReducer.ts
import type { User } from "@/types/user";
import type { AnyAction, Reducer } from "redux";

export interface UserState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  total: 0,
  loading: false,
  error: null,
};

export const userReducer: Reducer<UserState, AnyAction> = (
  state = initialState,
  action
): UserState => {
  switch (action.type) {
    case "FETCH_USERS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_USERS_SUCCESS": {
      const payload = action.payload as { users: User[]; total: number };
      return {
        ...state,
        loading: false,
        users: payload.users,
        total: payload.total,
      };
    }
    case "FETCH_USERS_FAILURE":
      return { ...state, loading: false, error: action.payload as string };
    case "CREATE_USER_REQUEST":
      return { ...state, loading: true };
    case "CREATE_USER_SUCCESS": {
      const payload = action.payload as User;
      return {
        ...state,
        loading: false,
        users: [...state.users, payload],
        total: state.total + 1,
      };
    }
    case "CREATE_USER_FAILURE":
      return { ...state, loading: false, error: action.payload as string };
    case "DELETE_USER_REQUEST":
      return { ...state, loading: true };
    case "DELETE_USER_SUCCESS":
      return {
        ...state,
        loading: false,
        users: state.users.filter(
          (u) => u.user_id !== (action.payload as number)
        ),
        total: state.total - 1,
      };
    case "DELETE_USER_FAILURE":
      return { ...state, loading: false, error: action.payload as string };
    default:
      return state;
  }
};
