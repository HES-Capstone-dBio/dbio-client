const defaultState = {};

/**
 * Resources reducer. Keeps a track of list of resources and
 * adds new ones to the list.
 */
const reducer = (state = defaultState, action) => {
  // Action to retrieve a list of all resources a user has access to
  if (action.type === "LIST_RESOURCES") {
    // The resources are in the action payload. Convert the array of resources
    // into an object from resource ID -> resource
    return action.payload.reduce((resourcesByID, resource) => {
      resourcesByID[resource.id] = resource;
      return resourcesByID;
    }, {});
  }

  // Action to retrieve a specific resource that a user has access to
  if (action.type === "GET_RESOURCE") {
    // Return an object consisting of current state and update the resource
    // by ID to include the payload from the full GET request
    return {
      ...state,
      [action.payload.id]: action.payload
    };
  }

  // Action to create a new resource
  if (action.type === "CREATE_RESOURCE") {
    // Add a new resource to state keyed by it's ID
    return {
      ...state,
      [action.payload.id]: {
        ...action.payload,
        body: undefined
      }
    };
  }

  return state;
};

export default reducer;