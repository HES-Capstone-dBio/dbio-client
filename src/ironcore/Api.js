import snackBar from "../components/UI/Snackbar/Snackbar";
import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/constants";
import snackbar from "../components/UI/Snackbar/Snackbar";

/**
 * Get a list of resources from protocol API
 */
export const listResources = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_ENDPOINT}/dbio/resources/${localStorage.getItem("ETH_ADDR")}`
    );
    return response.data;
  } catch (e) {
    snackbar("Error retrieving resources from database,", "error");
    throw new Error("Failed to retrieve resource list.");
  }
};

/**
 * Get a specific resource from the protocol API
 */
export const getResource = async (resourceID) => {
  try {
    const response = await axios.get(
      `${BACKEND_ENDPOINT}/dbio/resources/${localStorage.getItem(
        "ETH_ADDR"
      )}/${resourceID}`
    );

    response.data.id = resourceID;
    return response.data;
  } catch (e) {
    snackBar(`Error retrieving resouce with ID ${resourceID}`, "error");
    throw new Error("Failed to get resource.");
  }
};

/**
 * Create a new resource and add to storage
 */
export const createResource = async (resource) => {
  const newResource = {
    ...resource,
    created: Date.now(),
  };
  // Create a random ID to assign to this resource if it doesn't already have one
  if (!newResource.fhirResourceId) {
    newResource.fhirResourceId = Math.random().toString(36).slice(2);
  }

  // If there is no resource type assigned then assign "patient"
  // by default
  if (!newResource.resourceType) {
    newResource.resourceType = "patient";
  }

  try {
    await axios.post(`${BACKEND_ENDPOINT}/dbio/resources`, {
      email: localStorage.getItem("USER_EMAIL"),
      creator_eth_address: localStorage.getItem("ETH_ADDR"),
      resource_title: newResource.resourceTitle,
      resource_type: newResource.resourceType,
      fhir_resource_id: newResource.fhirResourceId,
      ironcore_document_id: newResource.ironcoreDocumentId,
      ciphertext: newResource.ciphertext,
    });
  } catch (e) {
    snackBar(`Failed to create resource`, "error");
    throw new Error("Failed to create resource");
  }
};
