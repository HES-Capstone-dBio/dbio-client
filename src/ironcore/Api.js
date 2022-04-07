import snackBar from "../components/UI/Snackbar/Snackbar";
import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/constants";

/**
 * Get a list of resources from protocol API
 * @TODO This API route is potentially retired. Open a ticket and investigate
 *       if it can be removed.
 */
export const listResources = () => {
  return new Promise((resolve) => {
    try {
      // @TODO STORAGE fetch resources from protocol API here
    } catch (error) {
      snackBar("Error retrieving resource list", "error");
    }
  });
};

/**
 * Get a specific resource from the protocol API
 */
export const getResource = (resourceID) => {
  return new Promise((resolve, reject) => {
    // @TODO STORAGE fetch specific resource from protocol API here
    axios.get(`${BACKEND_ENDPOINT}/dbio/resources/${localStorage.getItem("ETH_ADDR")}/${resourceID}`).then(
      (response) => {
        // @TODO This is temporary code that should be fixed. Setting the returned ID to the calling
        //       resource ID is a bandaid for a deeper problem.
        response.data.id = resourceID;
        resolve(response.data);
      },
      (error) => {
        snackBar(`Error retrieving resouce with ID ${resourceID}`, "error");
      }
    );
  });
};

/**
 * Create a new resource and add to storage
 */
export const createResource = (resource) => {
  return new Promise((resolve) => {
    const newResource = {
      ...resource,
      created: Date.now(),
    };

    // Create a random ID to assign to this resource if it doesn't already have one
    if (!newResource.id) {
      newResource.id = Math.random().toString(36).slice(2);
    }

    // Post the ciphertext to the protocol backend
    // @TODO the resource_type is temporary
    // @TODO Come up with better error handling schema here.
    axios
      .post(`${BACKEND_ENDPOINT}/dbio/resources`, {
        email: localStorage.getItem("USER_ID"),
        creator_eth_address: localStorage.getItem("ETH_ADDR"),
        resource_type: "Patient",
        resource_id: newResource.id,
        ciphertext: newResource.body,
      })
      .then(
        (response) => {
          console.log("Successfully posted a new resource to protocol backend");
        },
        (error) => {
          console.log(error);
        }
      );

    resolve(newResource);
  });
}