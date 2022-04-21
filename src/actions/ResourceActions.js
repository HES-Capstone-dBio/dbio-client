import { createAsyncThunk } from "@reduxjs/toolkit";
import * as resourceAPI from "../api/ResourceAPI";
import * as ironcoreAPI from "../api/IroncoreAPI";

/**
 * Async thunk action creator to get all resources available to user.
 */
export const listResources = createAsyncThunk(
  "resources/list",
  async (args, thunkAPI) => {
    const ethAddress = thunkAPI.getState().user.ethAddress;

    try {
      const resources = await resourceAPI.listResources(ethAddress);

      //Convert the array of resources into an object from resource ID -> resource
      const mappedResources = resources
        .map((resource) => {
          return {
            title: resource.resource_title,
            id: resource.fhir_resource_id,
            ironcoreDocumentId: resource.ironcore_document_id,
            created: resource.timestamp,
          };
        })
        .reduce((resourcesByID, resource) => {
          resourcesByID[resource.id] = resource;
          return resourcesByID;
        }, {});

      return { resources: mappedResources };
    } catch (e) {
      return thunkAPI.rejectWithValue("Unable to retrieve resource list.");
    }
  }
);

/**
 * Async thunk action creator to get a specific resource with resourceID.
 */
export const getResource = createAsyncThunk(
  "resources/get",
  async (args, thunkAPI) => {
    const ethAddress = thunkAPI.getState().user.ethAddress;

    try {
      // Retrieve resource from protocol backend
      const resource = await resourceAPI.getResource(
        args.resourceID,
        ethAddress
      );

      // Attempt to decrypt resource
      const decryptedResource = await ironcoreAPI.decryptResource({
        ironcoreDocumentId: resource.ironcore_document_id,
        ciphertext: resource.ciphertext,
      });

      return { id: args.resourceID, body: decryptedResource.data };
    } catch (e) {
      return thunkAPI.rejectWithValue("Unable to get resource");
    }
  }
);

/**
 * Thunk action creator for create resource.
 */
export const createResource = createAsyncThunk(
  "resources/create",
  async (args, thunkAPI) => {
    const ethAddress = thunkAPI.getState().user.ethAddress;
    const userEmail = thunkAPI.getState().user.email;
    const groupID = thunkAPI.getState().group.id;

    try {
      // Encrypt the resource
      const encryptedResource = await ironcoreAPI.encryptResource({
        body: args.body,
        title: args.title,
        groupID,
      });

      // Post the resource to protocol backend
      await resourceAPI.createResource({
        resourceTitle: encryptedResource.resourceTitle,
        ethAddress,
        userEmail,
        ironcoreDocumentId: encryptedResource.ironcoreDocumentId,
        ciphertext: encryptedResource.ciphertext,
      });
    } catch (e) {
      return thunkAPI.rejectWithValue("Unable to create resource");
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
