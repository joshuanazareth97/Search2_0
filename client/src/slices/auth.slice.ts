import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface AuthState {
  pubKey: string;
  token: string;
}

// Define the initial state using that type
const initialState: AuthState = {
  pubKey: "",
  token: "",
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ pubKey: string; token: string }>
    ) => {
      state.pubKey = action.payload.pubKey;
      state.token = action.payload.token;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
