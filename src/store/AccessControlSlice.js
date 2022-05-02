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
    },
    [listGrantedWriteRequests.pending]: (state, { payload }) => {
      state.isFetching = true;
    },
    [listGrantedWriteRequests.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
    },
    [listPendingWriteRequests.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.pendingWriteRequests = payload.pendingWriteRequests;
    },
    [listPendingWriteRequests.pending]: (state, { payload }) => {
      state.isFetching = true;
    },
    [listPendingWriteRequests.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
    },
    [listGrantedReadRequests.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.grantedReadRequests = payload.grantedReadRequests;
    },
    [listGrantedReadRequests.pending]: (state, { payload }) => {
      state.isFetching = true;
    },
    [listGrantedReadRequests]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
    },
    [listPendingReadRequests.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.pendingReadRequests = payload.pendingReadRequests;
    },
    [listPendingReadRequests.pending]: (state, { payload }) => {
      state.isFetching = true;
    },
    [listPendingReadRequests.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
    },
  },
});

export const accessControlSelector = (state) => state.accessControl;
export default accessControlSlice.reducer;
