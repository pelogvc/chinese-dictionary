import { combineReducers } from "redux";
import page from "./page";
import wordbook from "./wordbook";

const rootReducer = combineReducers({
  page,
  wordbook
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
