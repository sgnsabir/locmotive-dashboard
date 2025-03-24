// src/store/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login as loginApi, getCurrentUser } from "@/api/auth";
import { UserResponse, LoginResponse } from "@/types/auth";

// Define our User type for Redux state
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  twoFactorEnabled?: boolean;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  expiresIn: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  expiresIn: null,
  loading: false,
  error: null,
};

/**
 * Async thunk for login.
 *
 * This thunk first calls the backend login API. On success,
 * it immediately stores the received token so that subsequent
 * calls (like getCurrentUser) include the token via the getToken() helper.
 * Finally, it fetches the current user details.
 *
 * Robust error handling is implemented to reject with clear messages.
 */
export const loginThunk = createAsyncThunk<
  { user: User; token: string; expiresIn: number },
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ username, password }, thunkAPI) => {
  try {
    // Call login API and receive the token along with metadata
    const loginResponse: LoginResponse = await loginApi(username, password);
    // Immediately store the token in localStorage so that it is available for subsequent API calls
    localStorage.setItem("authToken", loginResponse.token);

    // Now call getCurrentUser so that the request includes the Authorization header with the token
    const userResponse: UserResponse = await getCurrentUser();
    if (!userResponse.roles || userResponse.roles.length === 0) {
      return thunkAPI.rejectWithValue("User role is missing in response");
    }
    const user: User = {
      id: userResponse.id,
      username: userResponse.username,
      email: userResponse.email,
      role: userResponse.roles[0],
      avatar: userResponse.avatar,
      twoFactorEnabled: userResponse.twoFactorEnabled,
      phone: userResponse.phone,
    };
    return {
      user,
      token: loginResponse.token,
      expiresIn: loginResponse.expiresIn,
    };
  } catch (error) {
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
          // Token is already saved in localStorage within the thunk
        }
      )
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
