import logger from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";
import resourcesReducer from "./ResourcesSlice";
import userReducer from "./UserSlice";
import accessControlReducer from "./AccessControlSlice";
import uiReducer from "./UISlice";
import ReduxThunk from "redux-thunk";

/**
 * Converts an object to a string and stores it in localStorage
 */
const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("persistantState", serializedState);
  } catch (e) {
    console.warn(e);
  }
};

/**
 * Loads a string from localStorage and converts it into
 * an Object. Invalid output is undefined.
 */
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("persistantState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
};

const middleware = [ReduxThunk];

if (process.env.NODE_ENV !== "production") {
  middleware.push(logger);
}

const enhancers = [...middleware];

const store = configureStore({
  reducer: {
    resources: resourcesReducer,
    accessControl: accessControlReducer,
    user: userReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  preloadedState: loadFromLocalStorage(),
  middleware: enhancers,
});

// Listen for any changes to the store and update localStorage
store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
