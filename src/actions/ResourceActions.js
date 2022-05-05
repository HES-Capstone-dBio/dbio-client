import { createAsyncThunk } from "@reduxjs/toolkit";
import * as resourceAPI from "../api/ResourceAPI";
import * as ironcoreAPI from "../api/IroncoreAPI";
import store from "../store";
import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers } from 'ethers';
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
          createdTime: new Date(resource.timestamp).toLocaleDateString(),
        };
      });

      return { claimedResources: mappedResources };
    } catch (e) {
      return thunkAPI.rejectWithValue("Unable to retrieve resource list.");
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
      return thunkAPI.rejectWithValue("Unable to retrieve resource list.");
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

      return { id: args.id, body: decryptedResource.data };
    } catch (e) {
      return thunkAPI.rejectWithValue("Unable to get resource");
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
      return thunkAPI.rejectWithValue("Unable to claim resource");
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

/**
 * Mints a single NFT
 */
export const mintNFT = async (ethKey, NFTVoucher) => {

  //Create a provider to connect to a testnet (Rinkeby) through Infura endpoint
  const rinkeby = new JsonRpcProvider(
    'https://rinkeby.infura.io/v3/3e19d71d0a034a7fbbf60362f83b3be2', //should be an env variable
    'rinkeby'
  );

  // Initiate the user's wallet
  let wallet = new ethers.Wallet(ethKey)
  wallet = wallet.connect(rinkeby) //connect the wallet to the network
  let address = await wallet.getAddress()

  //Example NFT voucher
  // {
  //   uri: "https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy65fbzdi",
  //   signature: "0x74acd2dc5ca48ab9fbe6fa564927a33053069ad7213cff8f45af23738f25284e4ddb95477447f01c7139f43ff0c78434d0b6fa55bca238c806340ae981af8f8a1c"
  // }

  //Initiate the contract using the Contract address, ABI, and the wallet of the user 
  var contract = new ethers.Contract(
    "0xEdd57d64f68D11cEF21bAacBfbcDE308DC1bF828",
    dBioContract1155,
    wallet);

  //Overrides for estimating the gas cost and nonce; need to be programmatic
  const overrides = {
    nonce: 12,
    gasLimit: "29999972",
    gasPrice: "2999997200"
  }

  //Initiate the transaction on the network
  let receipt = await contract.functions.redeem(address, NFTVoucher, overrides);
  console.log(receipt);

}

/**
 * Mints multiple NFTs
 */
export const mintManyNFT = async (ethKey, NFTVouchers) => {

  //Create a provider to connect to a testnet (Rinkeby) through Infura endpoint
  const rinkeby = new JsonRpcProvider(
    'https://rinkeby.infura.io/v3/3e19d71d0a034a7fbbf60362f83b3be2', //should be an env variable
    'rinkeby'
  );

  // Initiate the user's wallet
  let wallet = new ethers.Wallet(ethKey)
  wallet = wallet.connect(rinkeby) //connect the wallet to the network
  let address = await wallet.getAddress()

  //Example NFT voucher array
  // [{
  //   uri: "https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy65fbzdi",
  //   signature: "0x74acd2dc5ca48ab9fbe6fa564927a33053069ad7213cff8f45af23738f25284e4ddb95477447f01c7139f43ff0c78434d0b6fa55bca238c806340ae981af8f8a1c"
  // },{
  //   uri: "https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy65fbzdi",
  //   signature: "0x74acd2dc5ca48ab9fbe6fa564927a33053069ad7213cff8f45af23738f25284e4ddb95477447f01c7139f43ff0c78434d0b6fa55bca238c806340ae981af8f8a1c"
  // }]

  //Initiate the contract using the Contract address, ABI, and the wallet of the user 
  var contract = new ethers.Contract(
    "0xEdd57d64f68D11cEF21bAacBfbcDE308DC1bF828",
    dBioContract1155,
    wallet);

  //Overrides for estimating the gas cost and nonce; need to be programmatic
  const overrides = {
    nonce: 12,
    gasLimit: "29999972",
    gasPrice: "2999997200"
  }

  //Initiate the transaction on the network
  let receipt = await contract.functions.redeemMany(address, NFTVouchers, overrides);
  console.log(receipt);

}