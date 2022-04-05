import { createStore, applyMiddleware, compose} from 'redux';
import ReduxThunk from "redux-thunk";
import rootReducer from "../reducers/RootReducer";
import * as IronCoreMiddleware from "../middleware/IronCoreMiddleware";
import apiMiddleware from "../middleware/ApiMiddleware";
import logger from "redux-logger";

function getMiddleware() {
  const middleware = [ReduxThunk];

  // Push logger middleware
  middleware.push(logger);

  // Push the encryption and decryption middlewares
  middleware.push(IronCoreMiddleware.encryptionMiddleware);
  middleware.push(apiMiddleware);
  middleware.push(IronCoreMiddleware.decryptionMiddleware);

  return middleware;
}

const configureStore = (preLoadedState) => {

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...getMiddleware())));
  return store;
}

export default configureStore;
