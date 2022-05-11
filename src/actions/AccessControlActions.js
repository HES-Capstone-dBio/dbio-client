import { createAsyncThunk } from "@reduxjs/toolkit";
import * as accessControlAPI from "../api/AccessControlAPI";
import * as ironcoreAPI from "../api/IroncoreAPI";
import * as userAPI from "../api/UserAPI";
import store from "../store";

/**
 * Action creator to set the user's current group.
 */
export const setGroup = createAsyncThunk(
  "group/setGroup",
  async (group, thunkAPI) => {
    return { groupId: group.groupID };
  }
);

/**
 * Async thunk action creator to get all pending write requests
 * for a user.
 */
export const listGrantedWriteRequests = createAsyncThunk(
  "accessControl/grantedWriteRequestsList",
  async (args, thunkAPI) => {
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
            grantedTime: request.last_updated_time,
          };
        });

      return {
        grantedWriteRequests,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: "Unable to retrieve granted write requests",
      });
    }
  }
);

export const listPendingWriteRequests = createAsyncThunk(
  "accessControl/pendingWriteRequestList",
  async (args, thunkAPI) => {
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
            createdTime: request.created_time,
          };
        });
      return {
        pendingWriteRequests,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: "Unable to retrieve pending write requests",
      });
    }
  }
);

/**
 * Async thunk action creator to get all granted read requests
 * for a user.
 */
export const listGrantedReadRequests = createAsyncThunk(
  "accessControl/grantedReadRequestList",
  async (args, thunkAPI) => {
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
            createdTime: request.created_time,
            grantedTime: request.last_updated_time,
          };
        });
      return {
        grantedReadRequests,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: "Unable to retrieve granted read requests",
      });
    }
  }
);

/**
 * Async thunk action creator to get all pending read requests
 * for a user.
 */
export const listPendingReadRequests = createAsyncThunk(
  "accessControl/pendingReadRequestList",
  async (args, thunkAPI) => {
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
            createdTime: request.created_time,
          };
        });

      return {
        pendingReadRequests,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: "Unable to retrieve pending read requests",
      });
    }
  }
);

/**
 * Async thunk action creator to update read requests.
 */
export const updateReadRequest = createAsyncThunk(
  "accessControl/updateReadRequest",
  async (args, thunkAPI) => {
    try {
      const requests = args.requests;
      const approve = args.approve;

      const groupId = store.getState().accessControl.groupId;

      // Loop through each request in the array
      for (const request of requests) {
        // Get the user's email via their ethereum address
        const { email } = (await userAPI.getUser(request.ethAddress)).data;

        // Make a call to ironcore SDK to either add or remove user(s)
        // from group.
        if (approve) {
          await ironcoreAPI.addUserToGroup({ groupId, userId: email });
        } else {
          await ironcoreAPI.removeUserFromGroup({ groupId, userId: email });
        }

        try {
          await accessControlAPI.updateReadRequest(request.id, approve);
        } catch (e) {
          // If protocol call fails then roll back IronCore.
          if (!approve) {
            await ironcoreAPI.addUserToGroup({ groupId, userId: email });
          } else {
            await ironcoreAPI.removeUserFromGroup({ groupId, userId: email });
          }
        }
      }

      // Dispatch action to read access requests
      await thunkAPI.dispatch(listPendingReadRequests());
      await thunkAPI.dispatch(listGrantedReadRequests());
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: "Unable to update read request",
      });
    }
  }
);

/**
 * Async thunk action creator to update write requests.
 */
export const updateWriteRequest = createAsyncThunk(
  "accessControl/updateWriteRequest",
  async (args, thunkAPI) => {
    try {
      const requests = args.requests;
      const approve = args.approve;

      // Loop through each request in the array
      for (const request of requests) {
        await accessControlAPI.updateWriteRequest(request.id, approve);
      }

      // Dispatch action to update write access requests
      await thunkAPI.dispatch(listPendingWriteRequests());
      await thunkAPI.dispatch(listGrantedWriteRequests());
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: "Unable to grant write request",
      });
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
