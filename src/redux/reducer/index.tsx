import { combineReducers } from "redux";
import User from "./UserReducer";
import Trigger from "./TriggerReducer";
const rootReducer = combineReducers({
  User,
  Trigger,
});
export default rootReducer;
