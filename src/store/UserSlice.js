import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "../actions/UserActions";

const initialState = {
  name: "",
  picture: "",
  email: "",
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
    clearUserState() {
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
      state.name = payload.name;
      state.picture = payload.picture;
      state.email = payload.email;
      state.ethAddress = payload.ethAddress;
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
    [logoutUser.pending]: (state) => {
      state.isFetching = true;
    },
    [logoutUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
  },
});

export const userSelector = (state) => state.user;
export default userSlice.reducer;
