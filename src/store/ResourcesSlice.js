import { createSlice } from "@reduxjs/toolkit";
import {
  listResources,
  createResource,
  getResource,
} from "../actions/ResourceActions";

const initialState = {
  resources: [],
  isFetchingList: false,
  isCreatingResource: false,
  isFetchingResource: false,
  successFetchingList: false,
  successFetchingResource: false,
  successCreatingResource: false,
  isError: false,
  errorMessage: "",
};

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    clearResourcesState() {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: {
    // Retrieve a list of resources
    [listResources.fulfilled]: (state, { payload }) => {
      state.isFetchingList = false;
      state.isError = false;
      state.successFetchingList = true;
      state.resources = payload.resources;
      state.errorMessage = "";
    },
    [listResources.pending]: (state) => {
      state.isFetchingList = true;
    },
    [listResources.rejected]: (state, { payload }) => {
      state.isFetchingList = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [getResource.fulfilled]: (state, { payload }) => {
      state.isFetchingResource = false;
      state.successFetchingResource = true;
      state.resources[payload.id].body = payload.body;
      state.isError = false;
      state.errorMessage = "";
    },
    [getResource.pending]: (state) => {
      state.isFetchingResource = true;
    },
    [getResource.rejected]: (state, { payload }) => {
      state.isFetchingResource = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [createResource.fulfilled]: (state, { payload }) => {
      state.isCreatingResource = false;
      state.successCreatingResource = true;
      state.isError = false;
      state.errorMessage = "";
    },
    [createResource.pending]: (state) => {
      state.successCreatingResource = false;
      state.isCreatingResource = true;
    },
    [createResource.rejected]: (state, { payload }) => {
      state.successCreatingResource = false;
      state.isCreatingResource = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
  },
});

export const resourcesSelector = (state) => state.resources;
export default resourcesSlice.reducer;
