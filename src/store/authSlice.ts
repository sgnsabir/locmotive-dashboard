// src/store/authSlice.ts
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
  token: string | null;
  expiresIn: number | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  expiresIn: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Existing login action (for mock/demo usage)
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
      // For demo purposes, set dummy token values
      state.token = "dummy-token";
      state.expiresIn = 3600;
    },
    // New action to handle successful login from backend response
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string; expiresIn: number }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.expiresIn = action.payload.expiresIn;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.expiresIn = null;
    },
  },
});

export const { login, logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
