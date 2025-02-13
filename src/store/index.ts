// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { userReducer } from "./reducers/userReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, // now included so state.user is defined
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
