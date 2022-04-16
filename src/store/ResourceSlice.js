import { createSlice } from "@reduxjs/toolkit";

const initialState = { resources: [], changed: false };

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    // Retrieve a list of resources
    list(state, action) {
      // The resources are in the action payload. Convert the array of resources
      // into an object from resource ID -> resource
      state.resources = action.payload
        .map((resource) => {
          return {
            title: resource.resource_title,
            id: resource.fhir_resource_id,
            ironcoreDocumentId: resource.ironcore_document_id,
            created: resource.timestamp
          };
        })
        .reduce((resourcesByID, resource) => {
          resourcesByID[resource.id] = resource;
          return resourcesByID;
        }, {});
      state.changed = false;
    },
    get(state, action) {
      state.resources[action.payload.id].body = action.payload.body;
    },
    create(state, action) {
      state.changed = true;
    },
  },
});

export const resourceActions = resourceSlice.actions;
export default resourceSlice.reducer;
