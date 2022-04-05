import { combineReducers } from "redux";

import group from "./GroupReducer";
import resources from "./ResourcesReducer";

const rootReducer = combineReducers({
  group,
  resources,
});

export default rootReducer;