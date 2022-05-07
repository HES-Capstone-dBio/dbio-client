import { createAsyncThunk } from "@reduxjs/toolkit";
import * as IronWeb from "@ironcorelabs/ironweb";
import { initializeSDK, deauthSDK } from "../api/IroncoreAPI";

/**
 * Async Thunk action creator to initialize ironcore SDK.
 */
export const initializeIroncoreSDK = createAsyncThunk(
  "ui/initIroncore",
  async (userDetails, thunkAPI) => {
    const { getIdToken, privateKey } = userDetails;
    if (!IronWeb.isInitialized()) {
      try {
        await initializeSDK({ getIdToken, privateKey });
        return { ironcoreInitialized: true };
      } catch (e) {
        return thunkAPI.rejectWithValue({
          message: "Unable to initialize IronCore SDK",
        });
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
        await deauthSDK();
      } catch (e) {
        return thunkAPI.rejectWithValue({
          message: "Unable to deauthorize device from IronCore SDK.",
        });
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
