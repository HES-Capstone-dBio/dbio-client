import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/constants";

/**
 * Get a list of read request from protocol API
 */
export const listReadRequests = async (ethAddress) => {
  try {
    const response = await axios.get(
      `${BACKEND_ENDPOINT}/dbio/read_requests/${ethAddress}`,
      { params: { filter: "all" } }
    );

    return response.data;
  } catch (e) {
    console.log(e.message);
    throw new Error("Failed to retrieve read requests from server.");
  }
};

/**
 * Get a list of all write requests from protocol API
 */
export const listWriteRequests = async (ethAddress) => {
  try {
    const response = await axios.get(
      `${BACKEND_ENDPOINT}/dbio/write_requests/${ethAddress}`,
      { params: { filter: "all" } }
    );

    return response.data;
  } catch (e) {
    throw new Error("Failed to retrieve write requests from server.");
  }
};

/**
 * Update a read request that currently exist in the backend
 */
export const updateReadRequest = async (requestId, approve) => {
  try {
    const response = await axios.put(
      `${BACKEND_ENDPOINT}/dbio/read_requests/${requestId}`,
      {},
      { params: { approve } }
    );

    return response.data;
  } catch (e) {
    throw new Error(`Failed to update read request with ID ${requestId}`);
  }
};

/**
 * Update a write request that currently exist in the backend
 */
export const updateWriteRequest = async (requestId, approve) => {
  try {
    const response = await axios.put(
      `${BACKEND_ENDPOINT}/dbio/write_requests/${requestId}`,
      {},
      { params: { approve } }
    );

    return response.data;
  } catch (e) {
    throw new Error(`Failed to update write request with ID ${requestId}`);
  }
};

// PUT /dbio/read_requests/{id}?approve=(true|false)
