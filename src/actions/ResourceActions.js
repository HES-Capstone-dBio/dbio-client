import { createAsyncThunk } from "@reduxjs/toolkit";
import * as resourceAPI from "../api/ResourceAPI";
import * as ironcoreAPI from "../api/IroncoreAPI";
import store from "../store";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import dBioContract1155 from "../abi/DBioContract1155.abi.json";

/**
 * Async thunk action creator to get all resources available to user.
 */
export const listClaimedResources = createAsyncThunk(
  "resources/listClaimed",
  async (args, thunkAPI) => {
    try {
      const ethAddress = store.getState().user.ethAddress;

      const resources = await resourceAPI.listClaimedResources(ethAddress);

      //Convert the array of resources into an object from resource ID -> resource
      const mappedResources = resources.map((resource) => {
        return {
          id: resource.fhir_resource_id,
          ironcoreDocumentId: resource.ironcore_document_id,
          creatorEthAddress: resource.creator_eth_address,
          resourceType: resource.fhir_resource_type,
          ipfsCid: resource.ipfs_cid,
          ethNftVoucher: resource.eth_nft_voucher,
          nftMinted: resource.nft_minted,
          createdTime: new Date(resource.timestamp).toLocaleDateString(),
        };
      });

      return { claimedResources: mappedResources };
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: "Unable to retrieve claimed resources list.",
      });
    }
  }
);

/**
 * Async thunk action creator to get all resources available to user.
 */
export const listUnclaimedResources = createAsyncThunk(
  "resources/listUnclaimed",
  async (args, thunkAPI) => {
    try {
      const ethAddress = store.getState().user.ethAddress;

      const resources = await resourceAPI.listUnclaimedResources(ethAddress);

      // Remap array of objects from API
      const mappedResources = resources.map((resource) => {
        return {
          id: resource.fhir_resource_id,
          ironcoreDocumentId: resource.ironcore_document_id,
          creatorEthAddress: resource.creator_eth_address,
          resourceType: resource.fhir_resource_type,
          createdTime: new Date(resource.timestamp).toLocaleDateString(),
        };
      });

      return { unclaimedResources: mappedResources };
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: "Unable to retrieve unclaimed resources list.",
      });
    }
  }
);

/**
 * Async thunk action creator to get a specific claimed resource with resource ID.
 */
export const getClaimedResource = createAsyncThunk(
  "resources/getClaimed",
  async (args, thunkAPI) => {
    try {
      const ethAddress = store.getState().user.ethAddress;

      // Retrieve resource from protocol backend
      // Give resource ID and user's ethereum address
      const resource = await resourceAPI.getClaimedResource(
        args.id,
        args.resourceType,
        ethAddress
      );

      // Attempt to decrypt resource
      const decryptedResource = await ironcoreAPI.decryptResource({
        ironcoreDocumentId: resource.ironcore_document_id,
        ciphertext: resource.ciphertext,
      });

      return { id: args.id, body: JSON.parse(decryptedResource.data) };
    } catch (e) {
      return thunkAPI.rejectWithValue({ message: "Unable to get resource" });
    }
  }
);

/**
 * Thunk action creator to claim a resource
 */
export const claimResource = createAsyncThunk(
  "resources/claim",
  async (args, thunkAPI) => {
    try {
      const resources = args.resources;
      const groupId = store.getState().accessControl.groupId;
      const userEmail = store.getState().user.email;
      const ethAddress = store.getState().user.ethAddress;

      for (const resource of resources) {
        // Get the resource to be claimed
        const unclaimedResource = await resourceAPI.getUnclaimedResource(
          resource.fhirResourceId,
          resource.resourceType,
          ethAddress
        );

        // Attempt to decrypt the resource
        const decryptedResource = await ironcoreAPI.decryptResource({
          ironcoreDocumentId: unclaimedResource.ironcore_document_id,
          ciphertext: unclaimedResource.ciphertext,
        });

        // Next reencrypt the resource to your own group
        const encryptedResource = await ironcoreAPI.encryptResource({
          body: decryptedResource.data,
          title: unclaimedResource.fhir_resource_type,
          groupId,
        });

        // Then post the claimed resource to the protocol server
        await resourceAPI.createClaimedResource({
          userEmail,
          creatorEthAddress: resource.creatorEthAddress,
          resourceType: resource.resourceType,
          fhirResourceId: resource.fhirResourceId,
          ironcoreDocumentId: encryptedResource.ironcoreDocumentId,
          ciphertext: encryptedResource.ciphertext,
        });
      }

      // Update resource lists
      await thunkAPI.dispatch(listUnclaimedResources());
      await thunkAPI.dispatch(listClaimedResources());
    } catch (e) {
      return thunkAPI.rejectWithValue({ message: "Unable to claim resource" });
    }
  }
);
/**
 * Async thunk action creator to mint a single NFT associated with a resource.
 */
export const mintNFT = createAsyncThunk(
  "resources/mintNft",
  async (args, thunkAPI) => {
    try {
      console.log(args);
      const voucher = args.voucher;
      const privKey = store.getState().user.privateKey;

      //Create a provider to connect to a testnet (Rinkeby) through Infura endpoint
      const rinkeby = new JsonRpcProvider(
        process.env.REACT_APP_INFURA_ENDPOINT,
        "rinkeby"
      );

      // Initiate the user's wallet
      let wallet = new ethers.Wallet(privKey);
      wallet = wallet.connect(rinkeby); //connect the wallet to the network
      const address = await wallet.getAddress();

      //Initiate the contract using the Contract address, ABI, and the wallet of the user
      const contract = new ethers.Contract(
        process.env.SMART_CONTRACT_ADDRES,
        dBioContract1155,
        wallet
      );

      //Initiate the transaction on the network
      const receipt = await contract.functions.redeem(
        address,
        voucher
      );
      console.log(receipt); //we can probably return the hash to the enduser

      // Async code to attempt to mint a single NFT here
    } catch (e) {
      return thunkAPI.rejectWithValue({ message: "Unable to mint NFT" });
    }
  }
);

/**
 * Action to clear the state of resources
 */
export const clearResourcesState = () => {
  return {
    type: "resources/clearResourcesState",
  };
};
