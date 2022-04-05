import * as IronWeb from "@ironcorelabs/ironweb";
import { getTestGroup, setTestGroup } from "./Utils";

/**
 * Initialize the IronWeb SDK as the provider associated with a given JWT
 */
export const initializeIroncoreUser = (jwt, passcode) => {
  return IronWeb.initialize(
    () => Promise.resolve(jwt),
    () => Promise.resolve(passcode)
  );
};

/**
 * Get test group to operate within for demo purposes. This will either
 * retrieve an existing group if the ID is set in local storage. Otherwise
 * will create a new group. Either way details will be resolved about group.
 */
export const getTestGroupDetails = async () => {
  const existingTestGroup = getTestGroup();
  if (!existingTestGroup) {
    // First check if this group already exists in ironcore
    try {
      const group = await IronWeb.group.get(
        `dbio-test-${localStorage.getItem("USER_ID")}`
      );
      setTestGroup(group.groupID);
      return group;
    } catch (error) {}

    // If it doesn't then create a new group
    return IronWeb.group
      .create({ groupID: `dbio-test-${localStorage.getItem("USER_ID")}` })
      .then((group) => {
        setTestGroup(group.groupID);
        return group;
      });
  }
  return IronWeb.group.get(existingTestGroup);
};
