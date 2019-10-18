import { takeLatest, put, call, all, apply } from "redux-saga/effects";
import {
  SET_PAGE,
  SET_WORDS_REQUEST,
  setWordsRequest,
  SET_WORDS_FAILURE,
  SET_WORDS_SUCCESS
} from "../modules/wordbook";
import { ActionType } from "typesafe-actions";
import { setPage } from "../modules/page";
import { WordbookDatabase } from "../lib/WordbookDatabase";

const db = new WordbookDatabase();

function* callSetWordsRequest({ payload }: ActionType<typeof setPage>) {
  yield put({ type: SET_WORDS_REQUEST, payload });
}

function* getWords({ payload: page }: ActionType<typeof setWordsRequest>) {
  try {
    const response = yield call([db, db.searchByPage], page);

    if (!response) {
      throw new Error("단어장을 불러오는데 실패하였습니다.");
    }

    yield put({ type: SET_WORDS_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: SET_WORDS_FAILURE });
  }
}

export default function* wordbook() {
  yield all([
    takeLatest(SET_PAGE, callSetWordsRequest),
    takeLatest(SET_WORDS_REQUEST, getWords)
  ]);
}
