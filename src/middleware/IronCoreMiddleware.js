import * as IronWeb from "@ironcorelabs/ironweb";
import { resourceActions } from "../store/ResourceSlice";
import showSnackbar from "../components/UI/Snackbar/Snackbar";

/**
 * Take the create resource action and encrypt the resource body before passing
 * along the data to the next middleware.
 */
function encryptNewResource(next, action, groupID) {
  return IronWeb.document
    .encrypt(IronWeb.codec.utf8.toBytes(action.payload.body), {
      documentName: action.payload.title,
      accessList: { groups: [{ id: groupID }] },
    })
    .then((encryptedDoc) => {
      next({
        ...action,
        payload: {
          resourceTitle: encryptedDoc.documentName,
          ciphertext: IronWeb.codec.base64.fromBytes(encryptedDoc.document),
          ironcoreDocumentId: encryptedDoc.documentID,
        },
      });
    })
    .catch((e) => {
      showSnackbar(`Error encrypting document: ${e.message}`, "error");
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
      action.payload.ironcore_document_id,
      IronWeb.codec.base64.toBytes(action.payload.ciphertext)
    )
    .then((decryptedDoc) => {
      next({
        ...action,
        payload: {
          ...action.payload,
          title: decryptedDoc.documentName,
          created: decryptedDoc.created,
          body: IronWeb.codec.utf8.fromBytes(decryptedDoc.data),
        },
      });
    })
    .catch((e) => {
      if (e.code === IronWeb.ErrorCodes.DOCUMENT_GET_REQUEST_FAILURE) {
        showSnackbar("Order cannot be decrypted by this user!", "error");
      } else {
        showSnackbar(`Error decrypting document: ${e.message}`, "error");
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
  if (resourceActions.create.match(action)) {
    return encryptNewResource(next, action, store.getState().group.id);
  }
  next(action);
};

/**
 * Post middleware which runs after all other middlewares. This allows us to insert
 * our decryption routine after the API middleware runs to retrieve the encrypted
 * resource data from the dBio protocol API.
 */
export const decryptionMiddleware = (state) => (next) => (action) => {
  if (resourceActions.get.match(action)) {
    // Decrypt the data and modify the action content with the decrypted content before dispatching
    return decryptResource(next, action);
  }
  next(action);
};
