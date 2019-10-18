import { all, fork } from "redux-saga/effects";
import wordbook from "./wordbook";

export default function* rootSaga() {
  yield all([fork(wordbook)]);
}
