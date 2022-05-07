import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/constants";

/**
 * Get a list of claimed resources from protocol API
 */
export const listClaimedResources = async (ethAddress) => {
  try {
    const response = await axios.get(
      `${BACKEND_ENDPOINT}/dbio/resources/claimed/${ethAddress}/${ethAddress}`
    );

    return response.data;
  } catch (e) {
    throw new Error("Failed to retrieve claimed resource list.");
  }
};

/**
 * Get a list of unclaimed from protocol API
 */
export const listUnclaimedResources = async (ethAddress) => {
  try {
    const response = await axios.get(
      `${BACKEND_ENDPOINT}/dbio/resources/unclaimed/${ethAddress}/${ethAddress}`
    );

    return response.data;
  } catch (e) {
    throw new Error("Failed to retrieve resource unclaimed list.");
  }
};

/**
 * Get a specific claimed resource from the protocol API
 */
export const getClaimedResource = async (
  fhirResourceId,
  resourceType,
  ethAddress
) => {
  try {
    const response = await axios.get(
      `${BACKEND_ENDPOINT}/dbio/resources/claimed/${ethAddress}/${resourceType}/${fhirResourceId}/${ethAddress}`
    );

    return response.data;
  } catch (e) {
    throw new Error("Failed to get claimed resource.");
  }
};

/**
 * Get a specific unclaimed resource from the protocol API
 */
export const getUnclaimedResource = async (
  fhirResourceId,
  resourceType,
  ethAddress
) => {
  try {
    const response = await axios.get(
      `${BACKEND_ENDPOINT}/dbio/resources/unclaimed/${ethAddress}/${resourceType}/${fhirResourceId}/${ethAddress}`
    );

    return response.data;
  } catch (e) {
    throw new Error("Failed to get unclaimed resource.");
  }
};

/**
 * Create a new resource and add to storage
 */
export const createClaimedResource = async (payload) => {
  const newResource = {
    ...payload,
  };

  try {
    await axios.post(`${BACKEND_ENDPOINT}/dbio/resources/claimed`, {
      email: newResource.userEmail,
      creator_eth_address: newResource.creatorEthAddress,
      fhir_resource_type: newResource.resourceType,
      fhir_resource_id: newResource.fhirResourceId,
      ironcore_document_id: newResource.ironcoreDocumentId,
      ciphertext: newResource.ciphertext,
    });
  } catch (e) {
    throw new Error("Failed to create resource");
  }
};
