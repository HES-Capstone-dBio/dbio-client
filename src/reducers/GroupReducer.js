const defaultState = {
  id: null,
  admins: [],
  members: []
};

const reducer = (state = defaultState, action) => {
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