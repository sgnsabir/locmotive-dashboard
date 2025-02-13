import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  username: string;
  role: string;
  email?: string;
  avatar?: string;
  phone?: string;
  twoFactorEnabled?: boolean;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ username: string; password: string }>
    ) => {
      const { username, password } = action.payload;
      if (username === "admin" && password === "admin") {
        state.user = {
          username: "admin",
          role: "admin",
          email: "admin@example.com",
          avatar: "/images/admin-avatar.png",
          twoFactorEnabled: false,
        };
      } else {
        state.user = {
          username,
          role: "operator",
          email: `${username}@example.com`,
          avatar: "/images/default-avatar.png",
          twoFactorEnabled: false,
        };
      }
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
