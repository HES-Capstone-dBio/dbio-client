import { createSlice } from "@reduxjs/toolkit";
import { setGroup } from "../actions/GroupActions";

const initialState = {
  id: null,
  admins: [],
  members: [],
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    clearGroupState() {
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
      state.id = payload.groupID;
      state.admins = payload.groupAdmins;
      state.members = payload.groupMembers;
    },
    [setGroup.rejected]: (state, { payload }) => {
      state = { ...initialState };
    },
  },
});

export const groupSelector = (state) => state.group;
export default groupSlice.reducer;
