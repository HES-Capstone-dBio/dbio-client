import * as IronWeb from "@ironcorelabs/ironweb";

/**
 * Takes a body, title, and groupID. Encrypts the body and
 * returns the IronCore encrypted document which contains
 * the ciphertext.
 */
export const encryptResource = async (payload) => {
  const { body, title, groupId } = payload;
  try {
    const encryptedResource = await IronWeb.document.encrypt(
      IronWeb.codec.utf8.toBytes(body),
      {
        documentName: title,
        accessList: { groups: [{ id: groupId }] },
      }
    );

    return {
      resourceTitle: encryptedResource.documentName,
      ciphertext: IronWeb.codec.base64.fromBytes(encryptedResource.document),
      ironcoreDocumentId: encryptedResource.documentID,
    };
  } catch (e) {
    throw new Error("Unable to encrypt resource");
  }
};

/**
 * Decrypt the body of the provided resource and return an object
 * that includes the decrypted data.
 */
export const decryptResource = async (payload) => {
  try {
    const decryptedResource = await IronWeb.document.decrypt(
      payload.ironcoreDocumentId,
      IronWeb.codec.base64.toBytes(payload.ciphertext)
    );
    return {
      ...decryptedResource,
      data: IronWeb.codec.utf8.fromBytes(decryptedResource.data),
    };
  } catch (e) {
    throw new Error("Unable to decrypt resource");
  }
};

/**
 * Add a third party to the user's current group
 */
export const addUserToGroup = async (payload) => {
  try {
    await IronWeb.group.addMembers(payload.groupId, [payload.userId]);
  } catch (e) {
    throw new Error("Unable to grant access with IronCore");
  }
};

/**
 * Remove a third party from the user's current group
 */
export const removeUserFromGroup = async (payload) => {
  try {
    await IronWeb.group.removeMembers(payload.groupId, [payload.userId]);
  } catch (e) {
    throw new Error("Unable to remove access from IronCore");
  }
};

/**
 * Get IronCore details about a specific IronCore Group
 */
export const getGroupDetails = async (groupId) => {
  try {
    return await IronWeb.group.get(groupId);
  } catch (e) {
    throw new Error("Unable to get IronCore group details");
  }
};

/**
 * Initialize the IronCore SDK
 */
export const initializeSDK = async (payload) => {
  try {
    await IronWeb.initialize(payload.getIdToken, () =>
      Promise.resolve(payload.privateKey)
    );
    return true;
  } catch (e) {
    throw new Error("Unable to initialize IronCore SDK");
  }
};

/**
 * Deauthorize IronCore SDK
 */
export const deauthSDK = async () => {
  try {
    await IronWeb.user.deauthorizeDevice();
  } catch (e) {
    throw new Error("Unable to deauthorize IronCore SDK");
  }
};
