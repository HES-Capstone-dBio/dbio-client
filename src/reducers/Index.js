import { combineReducers } from "redux";

import group from "./GroupReducer";
import resources from "./ResourcesReducer";

export default combineReducers({
  group,
  resources
});