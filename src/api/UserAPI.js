import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/constants";

/**
 * Create a user in the backend protocol
 */
export const createUser = async (ethAddress, email) => {
  return await axios.post(`${BACKEND_ENDPOINT}/dbio/users`, {
    eth_public_address: ethAddress,
    email: email,
  });
};

/**
 * Get a user from the backend protocol
 */
export const getUser = async (ethAddress) => {
  return await axios.get(`${BACKEND_ENDPOINT}/dbio/users/eth/${ethAddress}`);
};
