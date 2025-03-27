// src/store/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login as loginApi, getCurrentUser } from "@/api/auth";
import { AuthState, LoginResponse, User, UserResponse } from "@/types/user";

const initialState: AuthState = {
  user: null,
  token: null,
  expiresIn: null,
  loading: false,
  error: null,
};

/**
 * Async thunk for login.
 * Calls the backend login API, then fetches the current user.
 */
export const loginThunk = createAsyncThunk<
  { user: User; token: string; expiresIn: number },
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ username, password }, thunkAPI) => {
  try {
    console.info("[auth/loginThunk] Calling login API for user:", username);
    const loginResponse: LoginResponse = await loginApi(username, password);

    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      return thunkAPI.rejectWithValue("Failed to store authentication token");
    }

    // Ensure token is set properly before fetching user details
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.info("[auth/loginThunk] Fetching current user details...");
    const userResponse: UserResponse = await getCurrentUser();

    if (!userResponse.roles || userResponse.roles.length === 0) {
      return thunkAPI.rejectWithValue("User role is missing in response");
    }

    const user: User = {
      id: userResponse.id,
      username: userResponse.username,
      email: userResponse.email,
      role: userResponse.roles[0],
      avatar: userResponse.avatar || "",
      twoFactorEnabled: userResponse.twoFactorEnabled || false,
      phone: userResponse.phone || "",
    };

    console.info("[auth/loginThunk] Login successful for user:", user);
    return {
      user,
      token: loginResponse.token,
      expiresIn: loginResponse.expiresIn,
    };
  } catch (error) {
    console.error("[auth/loginThunk] Login error:", error);
    localStorage.removeItem("authToken");
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message || "Login failed");
    }
    return thunkAPI.rejectWithValue("Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.expiresIn = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("authToken");
      console.info("[auth/logout] User logged out");
    },
    loginSuccess(
      state,
      action: PayloadAction<{ user: User; token: string; expiresIn: number }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.expiresIn = action.payload.expiresIn;
      state.error = null;
      state.loading = false;
      console.info(
        "[auth/loginSuccess] User state updated successfully:",
        action.payload.user
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginThunk.fulfilled,
        (
          state,
          action: PayloadAction<{
            user: User;
            token: string;
            expiresIn: number;
          }>
        ) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.expiresIn = action.payload.expiresIn;
          state.error = null;
          console.info(
            "[auth/loginThunk.fulfilled] Auth state updated:",
            action.payload.user
          );
        }
      )
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        console.error("[auth/loginThunk.rejected] Error:", state.error);
      });
  },
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
