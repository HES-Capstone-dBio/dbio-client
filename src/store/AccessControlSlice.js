import { createSlice } from "@reduxjs/toolkit";
import {
  setGroup,
  listGrantedReadRequests,
  listGrantedWriteRequests,
  listPendingReadRequests,
  listPendingWriteRequests,
} from "../actions/AccessControlActions";

const initialState = {
  groupId: null,
  pendingWriteRequests: [],
  pendingReadRequests: [],
  grantedWriteRequests: [],
  grantedReadRequests: [],
  isError: false,
  isFetching: false,
  isSuccess: false,
  errorMessage: "",
};

const accessControlSlice = createSlice({
  name: "accessControl",
  initialState,
  reducers: {
    clearAccessControlState() {
      return {
        ...initialState,
      };
    },
    addUser(state, action) {
      // Add a new user ID to the list of group members
      state.members.unshift(action.payload);
    },
    removeUser(state, action) {
      // Filter out user from list of users in group
      state.members.filter((user) => user !== action.payload);
    },
  },
  extraReducers: {
    [setGroup.fulfilled]: (state, { payload }) => {
      state.groupId = payload.groupId;
    },
    [setGroup.rejected]: (state, { payload }) => {
      state = { ...initialState };
    },
    [listGrantedWriteRequests.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.grantedWriteRequests = payload.grantedWriteRequests;
      state.errorMessage = "";
    },
    [listGrantedWriteRequests.pending]: (state, { payload }) => {
      state.isFetching = true;
    },
    [listGrantedWriteRequests.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [listPendingWriteRequests.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.pendingWriteRequests = payload.pendingWriteRequests;
      state.errorMessage = "";
    },
    [listPendingWriteRequests.pending]: (state, { payload }) => {
      state.isFetching = true;
    },
    [listPendingWriteRequests.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [listGrantedReadRequests.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.grantedReadRequests = payload.grantedReadRequests;
      state.errorMessage = "";
    },
    [listGrantedReadRequests.pending]: (state, { payload }) => {
      state.isFetching = true;
    },
    [listGrantedReadRequests.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [listPendingReadRequests.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.pendingReadRequests = payload.pendingReadRequests;
      state.errorMessage = "";
    },
    [listPendingReadRequests.pending]: (state, { payload }) => {
      state.isFetching = true;
    },
    [listPendingReadRequests.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
  },
});

export const accessControlSelector = (state) => state.accessControl;
export default accessControlSlice.reducer;
