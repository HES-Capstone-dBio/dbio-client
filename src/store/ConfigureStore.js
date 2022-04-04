import { createStore, applyMiddleware, compose} from 'redux';
import ReduxThunk from "redux-thunk";
import rootReducer from "../reducers/ResourcesReducer";
import * as IronCoreMiddleware from "../middleware/IronCoreMiddleware";

function getMiddleware() {
  const middleware = [ReduxThunk];

  // Push the encrpytion and decryption middlewares
  middleware.push(IronCoreMiddleware.encryptionMiddleware);
  middleware.push(IronCoreMiddleware.decryptionMiddleware);

  return middleware;
}

const configureStore = (preLoadedState) => {

  const composeEnhancers = compose;

  const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...getMiddleware())));
  return store;
}

export default configureStore;
