import { createAsyncThunk } from "@reduxjs/toolkit";
import * as accessControlAPI from "../api/AccessControlAPI";
import store from "../store";

/**
 * Action creator to set the user's current group.
 */
export const setGroup = createAsyncThunk(
  "group/setGroup",
  async (group, thunkAPI) => {
    return group;
  }
);

/**
 * Async thunk action creator to get all pending write requests
 * for a user.
 */
export const listGrantedWriteRequests = createAsyncThunk(
  "accessControl/grantedWriteRequestsList",
  async (thunkAPI) => {
    try {
      const ethAddress = store.getState().user.ethAddress;

      const writeRequests = await accessControlAPI.listWriteRequests(
        ethAddress
      );

      // Filter out the approved write requests
      const grantedWriteRequests = writeRequests
        .filter((request) => {
          return !request.request_open && request.request_approved;
        })
        .map((request) => {
          return {
            id: request.id,
            name: request.requestor_details,
            ethAddress: request.requestor_eth_address,
            requestApproved: request.request_approved,
            requestOpen: request.request_open,
            createdTime: request.created_time,
            approvedTime: request.last_updated_time,
          };
        });

      return {
        grantedWriteRequests,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue("Unable to retrieve write requests");
    }
  }
);

export const listPendingWriteRequests = createAsyncThunk(
  "accessControl/pendingWriteRequestList",
  async (thunkAPI) => {
    try {
      const ethAddress = store.getState().user.ethAddress;

      const writeRequests = await accessControlAPI.listWriteRequests(
        ethAddress
      );

      // Filter out pending write requests
      const pendingWriteRequests = writeRequests
        .filter((request) => {
          return request.request_open && !request.request_approved;
        })
        .map((request) => {
          return {
            id: request.id,
            name: request.requestor_details,
            ethAddress: request.requestor_eth_address,
            requestApproved: request.request_approved,
            requestOpen: request.request_open,
            createdTime: new Date(request.created_time).toLocaleDateString(),
          };
        });
      return {
        pendingWriteRequests,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue("Unable to retrieve write requests");
    }
  }
);

/**
 * Async thunk action creator to get all granted read requests
 * for a user.
 */
export const listGrantedReadRequests = createAsyncThunk(
  "accessControl/grantedReadRequestList",
  async (thunkAPI) => {
    try {
      const ethAddress = store.getState().user.ethAddress;

      const readRequests = await accessControlAPI.listReadRequests(ethAddress);

      const grantedReadRequests = readRequests
        .filter((request) => {
          return !request.request_open && request.request_approved;
        })
        .map((request) => {
          return {
            id: request.id,
            name: request.requestor_details,
            ethAddress: request.requestor_eth_address,
            requestApproved: request.request_approved,
            requestOpen: request.request_open,
            createdTime: new Date(request.created_time).toLocaleDateString(),
            approvedTime: request.last_updated_time,
          };
        });
      return {
        grantedReadRequests,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue("Unable to retrieve read requests");
    }
  }
);

/**
 * Async thunk action creator to get all pending read requests
 * for a user.
 */
export const listPendingReadRequests = createAsyncThunk(
  "accessControl/pendingReadRequestList",
  async (thunkAPI) => {
    try {
      const ethAddress = store.getState().user.ethAddress;

      const readRequests = await accessControlAPI.listReadRequests(ethAddress);

      // Filter out pending read requests
      const pendingReadRequests = readRequests
        .filter((request) => {
          return request.request_open && !request.request_approved;
        })
        .map((request) => {
          return {
            id: request.id,
            name: request.requestor_details,
            ethAddress: request.requestor_eth_address,
            requestApproved: request.request_approved,
            requestOpen: request.request_open,
            createdTime: new Date(request.created_time).toLocaleDateString(),
          };
        });

      return {
        pendingReadRequests,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue("Unable to retrieve read requests");
    }
  }
);

export const updateReadRequest = createAsyncThunk(
  "accessControl/updateReadRequest",
  async (args, thunkAPI) => {
    try {
      const groupId = store.getState().accessControl.groupId;
      const ethAddress = store.getState().user.ethAddress;

      // Check ironcore API if user already is member of group
      // If not member of group then add to member of group with ironcore API
      // If successfully addeded via ironcore API then call axios
      // If axios fails then remove from ironcore API
    } catch (e) {
      return thunkAPI.rejectWithValue("Unable to grant read request");
    }
  }
);

export const updateWriteRequest = createAsyncThunk(
  "accessControl/updateWriteRequest",
  async (args, thunkAPI) => {
    try {
      const groupId = store.getState().accessControl.groupId;
      const ethAddress = store.getState().user.ethAddress;
      // Check ironcore API if user already is member of group
      // If not member of group then add to member of group with ironcore API
      // If successfully addeded via ironcore API then call axios
      // If axios fails then remove from ironcore API
    } catch (e) {
      return thunkAPI.rejectWithValue("Unable to grant write request");
    }
  }
);

/**
 * Action to clear the state of access control
 */
export const clearAccessControlState = () => {
  return {
    type: "accessControl/clearAccessControlState",
  };
};
