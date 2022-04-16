import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  admins: [],
  members: []
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    // Set initial details about group
    setGroup (state, action) {
      state.id = action.payload.groupID;
      state.admins = action.payload.groupAdmins;
      state.members = action.payload.groupMembers;
    },
    addUser (state, action) {
      // Add a new user ID to the list of group members
      state.members.unshift(action.payload);
    },
    removeUser (state, action) {
      // Filter out user from list of users in group
      state.members.filter((user) => user !== action.payload)
    }
  }
});

export default groupSlice.reducer;