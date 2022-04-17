import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AUTH0_DOMAIN,
  verifierMap,
  GOOGLE,
  BACKEND_ENDPOINT,
} from "../constants/constants";
import TorusSdk from "@toruslabs/customauth";
import showSnackBar from "../components/UI/Snackbar/Snackbar";
import axios from "axios";
import { initializeIroncoreSDK, deauthIroncoreSDK } from "./UIActions";
import { setGroup } from "./GroupActions";
import { getGroupDetails } from "../ironcore/Initialization";

/**
 * Async thunk action creator that handles user login.
 */
export const loginUser = createAsyncThunk(
  "user/login",
  async (args, thunkAPI) => {
    try {
      const jwtParams = { domain: AUTH0_DOMAIN };
      const { typeOfLogin, clientId, verifier } = verifierMap[GOOGLE];

      const torusSDK = new TorusSdk({
        baseUrl: `${window.location.origin}/serviceworker`,
        enableLogging: true,
        network: "testnet",
      });
      await torusSDK.init({ skipSw: false });

      const loginDetails = await torusSDK.triggerLogin({
        typeOfLogin,
        verifier,
        clientId,
        jwtParams,
      });

      // Pull ID token from login details
      const idToken = loginDetails.userInfo.idToken;
      // Pull user private key from login details, this will be used
      // as the passcode for ironcore SDK intialization
      const privateKey = loginDetails.privateKey;
      // Store the user's public ethereum address. This will be used
      // for making backend API calls
      const ethAddress = loginDetails.publicAddress;
      // Retrieve user's email address
      const userEmail = loginDetails.userInfo.email;

      // At this point the user in logged in via TORUS. We should check if
      // the user exists in the backend.
      const getResponse = await axios.get(
        `${BACKEND_ENDPOINT}/dbio/users/email/${userEmail}`
      );

      // If we receive a 404 error it means that this user isn't currently
      // registered with dBio thus we need to make a post request to add them.
      if (getResponse.status === 404) {
        const postResponse = await axios.post(
          `${BACKEND_ENDPOINT}/dbio/users`,
          {
            eth_public_address: ethAddress,
            email: userEmail,
          }
        );

        // Check if post new user was successful
        if (postResponse.status !== 200) {
          throw new Error("Unable to create to new user");
        }

        showSnackBar("Thank you for registering with dBio", "success");
      }

      // Dispatch action to initialize ironcore SDK
      await thunkAPI.dispatch(initializeIroncoreSDK({ idToken, privateKey }));

      // Set the default group for the user (find this in Initialization.js)
      const groupDetails = await getGroupDetails(userEmail);

      // Dispatch action to set group
      await thunkAPI.dispatch(setGroup(groupDetails));

      // Store user email in local storage. This will be used for making
      // backend API calls.
      localStorage.setItem("USER_EMAIL", userEmail);

      // Store user public Ethereum address in local storage. This will be used
      // for making backend API calls.
      localStorage.setItem("ETH_ADDR", ethAddress);

      return {
        email: userEmail,
        idToken: idToken,
        privateKey: privateKey,
        ethAddress: ethAddress,
      };
    } catch (e) {
      console.log(e.message);
      return thunkAPI.rejectWithValue("Unable to log into dBio.");
    }
  }
);

/**
 * Async thunk action creator that handles logging a user out.
 */
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (args, thunkAPI) => {
    try {
      await thunkAPI.dispatch(deauthIroncoreSDK());
      // Remove user email from storage
      localStorage.removeItem("USER_EMAIL");
      // Remove Ethereum public address from local storage
      localStorage.removeItem("ETH_ADDR");
      showSnackBar("Successfully logged out of dBio", "success");
    } catch (e) {
      console.log(e.message);
      return thunkAPI.rejectWithValue("Error logging out of dBio.");
    }
  }
);

/**
 * Action to clear the state of user
 */
export const clearState = () => {
  return {
    type: "user/clearState",
  };
};
