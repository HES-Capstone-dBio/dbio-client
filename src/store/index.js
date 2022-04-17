import * as IronCoreMiddleware from "../middleware/IronCoreMiddleware";
import apiMiddleware from "../middleware/ApiMiddleware";
import logger from "redux-logger";
import { configureStore } from '@reduxjs/toolkit';
import resourceReducer from './ResourceSlice';
import userReducer from './UserSlice';
import groupReducer from './GroupSlice';
import ReduxThunk from "redux-thunk";


const middleware = [ReduxThunk];
middleware.push(logger);
middleware.push(IronCoreMiddleware.encryptionMiddleware);
middleware.push(apiMiddleware);
middleware.push(IronCoreMiddleware.decryptionMiddleware);

const enhancers = [...middleware];

const store = configureStore({
  reducer: {
    resources: resourceReducer,
    group: groupReducer,
    user: userReducer,
  },
  middleware: enhancers
});

export default store;