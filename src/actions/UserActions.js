import { createAsyncThunk } from "@reduxjs/toolkit";
import { TORUS_VERIFIER } from "../constants/constants";
import TorusSdk from "@toruslabs/customauth";
import showSnackBar from "../components/UI/Snackbar/Snackbar";
import * as IronWeb from "@ironcorelabs/ironweb";
import { initializeIroncoreSDK, deauthIroncoreSDK } from "./UIActions";
import { setGroup } from "./AccessControlActions";
import { getGroupDetails } from "../api/Initialization";
import { clearResourcesState } from "./ResourceActions";
import { clearUIState } from "./UIActions";
import { clearAccessControlState } from "./AccessControlActions";
import * as userAPI from "../api/UserAPI";

/**
 * Async thunk action creator that handles user login.
 */
export const loginUser = createAsyncThunk(
  "user/login",
  async (args, thunkAPI) => {
    try {
      const user = args.user;
      const getIdTokenClaims = args.getIdTokenClaims;
      const idToken = (await getIdTokenClaims()).__raw;

      const torusSDK = new TorusSdk({
        baseUrl: `${window.location.origin}/serviceworker`,
        enableLogging: true,
        network: "testnet",
      });
      await torusSDK.init({ skipSw: true });

      const torusKey = await torusSDK.getTorusKey(
        TORUS_VERIFIER,
        user.sub,
        { verifier_id: user.sub },
        idToken
      );

      // Pull user private key from login details, this will be used
      // as the passcode for ironcore SDK intialization
      const privateKey = torusKey.privateKey;
      // Store the user's public ethereum address. This will be used
      // for making backend API calls
      const ethAddress = torusKey.publicAddress;
      // Retrieve user's email address
      const userEmail = user.email;

      // At this point the user in logged in via TORUS. We should check if
      // the user exists in the backend.
      try {
        await userAPI.getUser(ethAddress);
      } catch (e) {
        // If we receive a 404 error it means that this user isn't currently
        // registered with dBio thus we need to make a post request to add them.
        if (e.response.status === 404) {
          const postResponse = await userAPI.createUser(ethAddress, userEmail);

          // Check if post new user was successful
          if (postResponse.status !== 200) {
            throw new Error("Unable to create to new user");
          }
          showSnackBar("Thank you for registering with dBio", "success");
        }
      }

      const getIdToken = async () => {
        return (await getIdTokenClaims()).__raw;
      };

      // Dispatch action to initialize ironcore SDK
      await thunkAPI.dispatch(
        initializeIroncoreSDK({ getIdToken, privateKey })
      );

      // Set the default group for the user (find this in Initialization.js)
      const groupDetails = await getGroupDetails(userEmail);

      // Dispatch action to set group
      await thunkAPI.dispatch(setGroup(groupDetails));

      return {
        name: user.name,
        picture: user.picture,
        email: userEmail,
        ethAddress: ethAddress,
        privateKey: privateKey,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: "Unable to log into dBio at this time.",
      });
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
      // If IronCore SDK is initialized then dispatch action
      // to deauthorize device
      if (IronWeb.isInitialized()) {
        await thunkAPI.dispatch(deauthIroncoreSDK());
      }

      // Clear all state
      await thunkAPI.dispatch(clearUserState());
      await thunkAPI.dispatch(clearAccessControlState());
      await thunkAPI.dispatch(clearResourcesState());
      await thunkAPI.dispatch(clearUIState());
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: "Error logging out of dBio.",
      });
    }
  }
);

/**
 * Action to clear the state of user
 */
export const clearUserState = () => {
  return {
    type: "user/clearUserState",
  };
};
