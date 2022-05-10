import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "../actions/UserActions";

const initialState = {
  name: "",
  picture: "",
  email: "",
  ethAddress: "",
  isLoggedIn: false,
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
  privateKey: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUIState() {
      return {
        ...initialState,
      };
    },
    clearCurrentErrorState(state) {
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: {
    [loginUser.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.isLoggedIn = true;
      state.name = payload.name;
      state.picture = payload.picture;
      state.email = payload.email;
      state.ethAddress = payload.ethAddress;
      state.privateKey = payload.privateKey;
      state.errorMessage = "";
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
