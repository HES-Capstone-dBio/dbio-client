import { createSlice } from "@reduxjs/toolkit";
import { initializeIroncoreSDK, deauthIroncoreSDK } from "../actions/UIActions";

const initialState = {
  ironcoreInitialized: "",
  isError: false,
  errorMessage: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    clearUIState() {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: {
    [initializeIroncoreSDK.fulfilled]: (state, { payload }) => {
      state.ironcoreInitialized = payload.ironcoreInitialized;
    },
    [initializeIroncoreSDK.rejected]: (state, { payload }) => {
      state.ironcoreInitialized = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [deauthIroncoreSDK.fulfilled]: (state, { payload }) => {
      state = { ...initialState };
    },
    [deauthIroncoreSDK.rejected]: (state, { payload }) => {
      state.isError = true;
      state.errorMessage = payload.message;
    },
  },
});

export const uiSelector = (state) => state.ui;
export default uiSlice.reducer;
