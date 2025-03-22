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
 * This thunk calls the backend login API and then fetches current user details.
 * Additional debug logs are added to help trace the login flow.
 */
export const loginThunk = createAsyncThunk<
  { user: User; token: string; expiresIn: number },
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ username, password }, thunkAPI) => {
  console.debug("loginThunk: Attempting login with username:", username);
  try {
    const loginResponse: LoginResponse = await loginApi(username, password);
    console.debug("loginThunk: Received loginResponse:", loginResponse);
    const userResponse: UserResponse = await getCurrentUser();
    console.debug("loginThunk: Received userResponse:", userResponse);
    if (!userResponse.roles || userResponse.roles.length === 0) {
      console.error(
        "loginThunk: User role is missing in response",
        userResponse
      );
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
    console.debug("loginThunk: Login successful, dispatching user:", user);
    return {
      user,
      token: loginResponse.token,
      expiresIn: loginResponse.expiresIn,
    };
  } catch (error) {
    console.error("loginThunk: Error during login process:", error);
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message || "Login failed");
    } else {
      return thunkAPI.rejectWithValue("Login failed");
    }
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
          localStorage.setItem("authToken", action.payload.token);
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
