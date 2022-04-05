import * as Api from "../ironcore/Api";

/**
 * Action to get all resources available to user.
 */
export const listResources = () => {
  return {
    type: "LIST_RESOURCES",
    operation: Api.listResources
  };
};

/**
 * Action to get a specific resource with resourceID.
 */
export const getResource = (resourceID, onFail) => {
  return {
    type: "GET_RESOURCE",
    payload: resourceID,
    operation: Api.getResource,
    onFail
  };
};

/**
 * Action to create a new resource. On the client side this will only be 
 * used for testing the functionality of IronCore as the user of the dBio client
 * never creates new resources.
 */
export const createResource = (body, onSuccess, onFail) => {
  return {
    type: "CREATE_RESOURCE",
    payload: {
      body
    },
    operation: Api.createResource,
    onSuccess,
    onFail
  };
}