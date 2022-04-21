import { createAsyncThunk } from "@reduxjs/toolkit";
import * as IronWeb from "@ironcorelabs/ironweb";

/**
 * Async Thunk action creator to initialize ironcore SDK.
 */
export const initializeIroncoreSDK = createAsyncThunk(
  "ui/initIroncore",
  async (userDetails, thunkAPI) => {
    const { idToken, privateKey } = userDetails;
    if (!IronWeb.isInitialized()) {
      try {
        await IronWeb.initialize(
          () => Promise.resolve(idToken),
          () => Promise.resolve(privateKey)
        );
        return { ironcoreInitialized: true };
      } catch (e) {
        console.log(e.message);
        return thunkAPI.rejectWithValue("Unable to initialize IronCore SDK");
      }
    }
  }
);

/**
 * Async Thunk action creator to initialize ironcore SDK.
 */
export const deauthIroncoreSDK = createAsyncThunk(
  "ui/deauthIroncore",
  async (thunkAPI) => {
    if (IronWeb.isInitialized) {
      try {
        await IronWeb.user.deauthorizeDevice();
      } catch (e) {
        console.log(e.message);
        return thunkAPI.rejectWithValue(
          "Unable to deauthorize device from IronCore SDK."
        );
      }
    }
    return { ironcoreInitialied: false };
  }
);

/**
 * Action to clear the state of ui
 */
export const clearUIState = () => {
  return {
    type: "ui/clearUIState",
  };
};
