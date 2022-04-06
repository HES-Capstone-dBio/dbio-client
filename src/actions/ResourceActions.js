import * as IronWeb from "@ironcorelabs/ironweb";
import * as Api from "../ironcore/Api";
import showSnackbar from "../components/UI/Snackbar/Snackbar";

/**
 * Action to get all resources available to user.
 */
export const listResources = (onSuccess, onFail) => {
  return (dispatch, getState) => {
    IronWeb.document
      .list()
      .then((listResult) => {
        // Check if we actually have any documents in the list
        if (listResult.result.length) {
          dispatch({
            type: "LIST_RESOURCES",
            payload: listResult.result.map((resource) => ({
              id: resource.documentID,
              created: resource.created,
              title: resource.documentName,
            })),
          });
          onSuccess();
        } else {
          onFail();
          showSnackbar(
            "Unable to retrieve a list of encrypted documents from IronCore.",
            "error"
          );
        }
      })
      .catch((error) => {
        onFail();
        showSnackbar(error.message, "error");
      });
  };
};

/**
 * Add user to group with specific ID. user.id is the email
 * of the user you wish to add to group.
 */
export function addUserToGroup(user, onSuccess, onFail) {
  return (dispatch, getState) => {
    IronWeb.group
      .addMembers(getState().group.id, [user.id])
      .then((addResult) => {
        if (addResult.succeeded.length) {
          dispatch({ type: "ADD_USER_TO_GROUP", payload: user.id });
          onSuccess();
        } else {
          onFail();
          showSnackbar(
            `Unable to give ${user.id} access. Make sure they are a dBio member.`,
            "error"
          );
        }
      })
      .catch((error) => {
        onFail();
        showSnackbar(error.message, "error");
      });
  };
}

/**
 * Action to get a specific resource with resourceID.
 */
export const getResource = (resourceID, onFail) => {
  return {
    type: "GET_RESOURCE",
    payload: resourceID,
    operation: Api.getResource,
    onFail,
  };
};

/**
 * Action to create a new resource. On the client side this will only be
 * used for testing the functionality of IronCore as the user of the dBio client
 * never creates new resources.
 */
export const createResource = (title, body, onSuccess, onFail) => {
  return {
    type: "CREATE_RESOURCE",
    payload: {
      title,
      body,
    },
    operation: Api.createResource,
    onSuccess,
    onFail,
  };
};
