const defaultState = {
  id: null,
  admins: [],
  members: []
};

const reducer = (state = defaultState, action) => {
  if (action.type === "SET_GROUP") {
    // Set initial details about group
    return {
      id: action.payload.groupID,
      admins: action.payload.groupAdmins,
      members: action.payload.groupMembers
    };
  }

  // Action for adding a new user to a group
  if (action.type === "ADD_USER_TO_GROUP") {
    // Add a new user ID to the list of group members
    return {
      ...state,
      members: [action.payload, ...state.members]
    };
  }

  // Action to remove user from group
  if (action.type === "REMOVE_USER_FROM_GROUP") {
    // Filter out the user from the list of users in the group
    return {
      ...state,
      members: state.members.filter((user) => user !== action.payload)
    };
  }
  return state;
}

export default reducer;