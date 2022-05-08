import { createSlice } from "@reduxjs/toolkit";
import {
  listClaimedResources,
  listUnclaimedResources,
  getClaimedResource,
  claimResource,
  mintNFT,
} from "../actions/ResourceActions";

const initialState = {
  claimedResources: [],
  unclaimedResources: [],
  isFetchingList: false,
  isFetchingResource: false,
  isClaimingResource: false,
  isMintingNft: false,
  successClaimingResource: false,
  successFetchingList: false,
  successFetchingResource: false,
  successMintingNft: false,
  currentResourceBody: "",
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
    clearCurrentResourceBody(state) {
      state.currentResourceBody = "";
    },
    clearCurrentErrorState(state) {
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: {
    [listClaimedResources.fulfilled]: (state, { payload }) => {
      state.isFetchingList = false;
      state.isError = false;
      state.successFetchingList = true;
      state.claimedResources = payload.claimedResources;
      state.errorMessage = "";
    },
    [listClaimedResources.pending]: (state) => {
      state.isFetchingList = true;
    },
    [listClaimedResources.rejected]: (state, { payload }) => {
      state.isFetchingList = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [listUnclaimedResources.fulfilled]: (state, { payload }) => {
      state.isFetchingList = false;
      state.isError = false;
      state.successFetchingList = true;
      state.unclaimedResources = payload.unclaimedResources;
      state.errorMessage = "";
    },
    [listUnclaimedResources.pending]: (state) => {
      state.isFetchingList = true;
    },
    [listUnclaimedResources.rejected]: (state, { payload }) => {
      state.isFetchingList = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [getClaimedResource.fulfilled]: (state, { payload }) => {
      state.isFetchingResource = false;
      state.isError = false;
      state.successFetchingResource = true;
      state.currentResourceBody = payload.body;
      state.errorMessage = "";
    },
    [getClaimedResource.pending]: (state) => {
      state.isFetchingResource = true;
    },
    [getClaimedResource.rejected]: (state, { payload }) => {
      state.isFetchingResource = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [claimResource.fulfilled]: (state, { payload }) => {
      state.isClaimingResource = false;
      state.isError = false;
      state.successClaimingResource = true;
      state.errorMessage = "";
    },
    [claimResource.pending]: (state, { payload }) => {
      state.isClaimingResource = true;
    },
    [claimResource.rejected]: (state, { payload }) => {
      state.isClaimingResource = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [mintNFT.fulfilled]: (state, { payload }) => {
      state.isMintingNft = false;
      state.isError = false;
      state.successMintingNft = true;
      state.errorMessage = "";
    },
    [mintNFT.pending]: (state, { payload }) => {
      state.isMintingNft = true;
    },
    [mintNFT.rejected]: (state, { payload }) => {
      state.isMintingNft = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
  },
});

export const resourcesSelector = (state) => state.resources;
export const resourcesActions = resourcesSlice.actions;
export default resourcesSlice.reducer;
