import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/constants";

/**
 * Get a list of resources from protocol API
 */
export const listResources = async (ethAddress) => {
  try {
    const response = await axios.get(
      `${BACKEND_ENDPOINT}/dbio/resources/${ethAddress}`
    );

    return response.data;
  } catch (e) {
    throw new Error("Failed to retrieve resource list.");
  }
};

/**
 * Get a specific resource from the protocol API
 */
export const getResource = async (resourceID, ethAddress) => {
  try {
    const response = await axios.get(
      `${BACKEND_ENDPOINT}/dbio/resources/${ethAddress}/${resourceID}`
    );

    response.data.id = resourceID;
    return response.data;
  } catch (e) {
    throw new Error("Failed to get resource.");
  }
};

/**
 * Create a new resource and add to storage
 */
export const createResource = async (payload) => {
  const newResource = {
    ...payload,
    // created: Date.now(),
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
      email: newResource.userEmail,
      creator_eth_address: newResource.ethAddress,
      resource_type: newResource.resourceType,
      resource_title: newResource.resourceTitle,
      fhir_resource_id: newResource.fhirResourceId,
      ironcore_document_id: newResource.ironcoreDocumentId,
      ciphertext: newResource.ciphertext,
    });
  } catch (e) {
    throw new Error("Failed to create resource");
  }
};
