
export const GROUP_ID_STORAGE_KEY = "dbio-test-group";

/**
 * Get any existing group ID from local storage
 */
export const getTestGroup = () => {
  return localStorage.getItem(GROUP_ID_STORAGE_KEY);
};

export const setTestGroup = (groupID) => {
  return localStorage.setItem(GROUP_ID_STORAGE_KEY, groupID);
};