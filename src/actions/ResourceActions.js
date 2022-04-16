import * as Api from "../ironcore/Api";
import { resourceActions } from "../store/ResourceSlice";

/**
 * Thunk action creator to get all resources available to user.
 */
 export const listResources = (onSuccess, onFail) => {
  return {
    type: "resource/list",
    payload: [],
    operation: Api.listResources,
    onSuccess,
    onFail,
  };
};

/**
 * Thunk action creator to get a specific resource with resourceID.
 */
export const getResource = (resourceID, onFail) => {
  return {
    type: "resource/get",
    payload: resourceID,
    operation: Api.getResource,
    onFail,
  };
};

/**
 * Thunk action creator for create resource.
 */
export const createResource = (title, body, onSuccess, onFail) => {
  return {
    type: "resource/create",
    payload: {
      title,
      body,
    },
    operation: Api.createResource,
    onSuccess,
    onFail,
  };
};

export default resourceActions;