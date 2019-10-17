import { combineReducers } from "redux";
import page from './page'

const rootReducer = combineReducers({
    page
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>