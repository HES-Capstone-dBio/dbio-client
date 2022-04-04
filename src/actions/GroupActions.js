import * as IronWeb from "@ironcorelabs/ironweb";

/**
 * Store details about the user's current group
 */
export function setGroup(group) {
  return {
    type: "SET_GROUP",
    payload: group
  };
}

/**
 * Add user to group with specific ID. user.id is the email
 * of the user you wish to add to group.
 */
export function addUserToGroup(user, onSuccess, onFail) {
  return (dispatch, getState) => {
    IronWeb.group
    .addMembers(getState().group.id, [user.id])
    .then((addResult) => {
      if(addResult.succeeded.length) {
        dispatch({type: "ADD_USER_TO_GROUP", payload: user.id});
        onSuccess();
      }
      else {
        onFail();
        // @TODO Display error popup
        console.log("Failed to add user to group");
      }
    })
    .catch((error) => {
      onFail();
      // @TODO Display error popup
      console('Failed to add user to group');
    });
  };
}

/**
 * Remove a user from a group
 */
export function removeUserFromGroup(user, onSuccess, onFail) {
  return (dispatch, getState) => {
    IronWeb.group
    .removeMembers(getState().group.id, [user.id])
    .then((removeResult) => {
      if (removeResult.succeeded.length) {
        dispatch({type: "REMOVE_USER_FROM_GROUP", payload: user.id})
        onSuccess();
      } else {
        onFail();
        // @TODO Show error popup
        console.log("remove result failed");
      }
    })
    .catch((error) => {
      onFail();
      // @TODO show error popup
      console.log("Remove user from group failed");
    });
  };
}