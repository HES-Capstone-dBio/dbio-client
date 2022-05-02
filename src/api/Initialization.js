import * as IronWeb from "@ironcorelabs/ironweb";
import { accessControlSelector } from "../store/AccessControlSlice";

/**
 * Get test group to operate within for demo purposes. This will either
 * retrieve an existing group if the ID is set in local storage. Otherwise
 * will create a new group. Either way details will be resolved about group.
 */
export const getGroupDetails = async (userEmail) => {
  if (!accessControlSelector.groupId) {
    try {
      // First check if this group already exists in ironcore
      return await IronWeb.group.get(`dbio-test-${userEmail}`);
    } catch (e) {}

    try {
      // Group doesn't exist so create it
      return IronWeb.group.create({ groupId: `dbio-test-${userEmail}` });
    } catch (e) {
      console.log(e.message);
      throw new Error("Unable to create IronCore group.");
    }
  }
};
