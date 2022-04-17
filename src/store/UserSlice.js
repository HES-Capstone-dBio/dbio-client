import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "../actions/UserActions";

const initialState = {
  email: "",
  idToken: "",
  privateKey: "",
  ethAddress: "",
  currentGroup: null,
  isLoggedIn: false,
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearState() {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: {
    [loginUser.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.isLoggedIn = true;
      state.email = payload.email;
      state.idToken = payload.idToken;
      state.ethAddress = payload.ethAddress;
      state.privateKey = payload.privateKey;
    },
    [loginUser.pending]: (state) => {
      state.isFetching = true;
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [logoutUser.fulfilled]: (state, { payload }) => {
      state = { ...initialState };
    },
    [logoutUser.rejected]: (state, { payload }) => {
      state.isError = true;
      state.errorMessage = payload.message;
    },
  },
});

export const userSelector = (state) => state.user;
export default userSlice.reducer;
