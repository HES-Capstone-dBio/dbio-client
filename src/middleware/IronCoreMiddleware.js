import * as IronWeb from "@ironcorelabs/ironweb";
import showSnackbar from "../components/UI/Snackbar/Snackbar";

/**
 * Take the create resource action and encrypt the resource body before passing
 * along the data to the next middleware.
 */
function encrpytNewResource(next, action, groupID) {
  return IronWeb.document
    .encrypt(IronWeb.codec.utf8.toBytes(action.payload.body), {
      accessList: { groups: [{ id: groupID }] },
    })
    .then((encryptedDoc) => {
      next({
        ...action,
        payload: {
          ...action.payload,
          body: IronWeb.codec.base64.fromBytes(encryptedDoc.document),
          id: encryptedDoc.documentID,
          encrypted: true,
        },
      });
    })
    .catch((error) => {
      showSnackbar(`Error encrypting document: ${error.message}`, "error")
      if (action.onFail) {
        action.onFail();
      }
    });
}

/**
 * Decrypt the body of the provided resource get action before passing along
 * the decrypted content to the next middleware.
 */
function decryptResource(next, action) {
  IronWeb.document
    .decrypt(
      action.payload.id,
      IronWeb.codec.base64.toBytes(action.payload.body)
    )
    .then((decryptedDoc) => {
      next({
        ...action,
        payload: {
          ...action.payload,
          body: IronWeb.codec.utf8.fromBytes(decryptedDoc.data),
        },
      });
    })
    .catch((error) => {
      if (error.code === IronWeb.ErrorCodes.DOCUMENT_GET_REQUEST_FAILURE) {
        showSnackbar("Order cannot be decrypted by this user!", "error")
      } else {
        showSnackbar(`Error decrypting document: ${error.message}`, "error");
      }
      if (action.onFail) {
        action.onFail();
      }
    });
}

/**
 * Pre middleware which runs before all other middlewares. This allows us
 * to insert our encryption routine before the API middleware runs to
 * create a POST request to the dBio protocol to save the encrypted
 * resource data.
 */
export const encryptionMiddleware = (store) => (next) => (action) => {
  if (action.type === "CREATE_RESOURCE") {
    return encrpytNewResource(next, action, store.getState().group.id);
  }
  next(action);
};

/**
 * Post middleware which runs after all other middlewares. This allows us to insert
 * our decryption routine after the API middleware runs to retrieve the encrypted
 * resource data from the dBio protocol API.
 */
export const decryptionMiddleware = (state) => (next) => (action) => {
  if (action.type === "GET_RESOURCE") {
    // When a user requests a resource we must conditionally decrypt the data
    // if that data is encrypted. If this resource was created prior to encryption
    // then we just want to pass it along. Otherwise, we want to decrypt it and pass
    // along an action with the decrypted data.
    if (action.payload.encrypted) {
      // Decrypt the data and modify the action content with the decrypted content before dispatching
      return decryptResource(next, action);
    }
    // Per above comment this is the case where data hasn't been encrypted yet
    return next(action);
  }
  next(action);
};
