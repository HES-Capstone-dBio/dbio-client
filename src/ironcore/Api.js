
/**
 * Get a list of resources from protocol API
 */
export const listResources = () => {
  return new Promise((resolve) =>{
    try {
      // @TODO fetch resources from protocol API here
    } catch (error) {
      console.log('Error retrieving resource list')
    }
  });
};

/**
 * Get a specific resource from the protocol API
 */
export const getResource = (resourceID) => {
  return new Promise((resolve, reject) => {
    try {
      // @TODO fetch specific resource from protocol API here
    } catch (error) {
      console.log(`Error retrieving resource with ID ${resourceID}`);
    }
  });
};

/**
 * Create a new resource and add to storage
 */
export const createResource = (resource) => {
  console.log('in create resource api');
  return new Promise((resolve) => {
    const newResource = {
      ...resource,
      created: Date.now()
    };
    // Create a random ID to assign to this resource if it doesn't already have one
    if (!newResource.id) {
      newResource.id = Math.random().toString(36).slice(2);
    }
    // @TODO At this point we add the new item to storage whether that be local
    //       or a POST request to outside API.

    resolve(newResource);
  });
};

