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

export const addUserToGroup = async (payload) => {
  try {
    IronWeb.group.addMembers(payload.groupId, payload.userId);
  } catch (e) {
    throw new Error("Unable to grant access with IronCore");
  }
};
