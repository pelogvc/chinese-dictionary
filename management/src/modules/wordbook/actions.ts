import { createAction, createStandardAction } from "typesafe-actions";
import { Word } from "./types";

export const SET_PAGE = "wordbook/SET_PAGE";
export const SET_WORDS_REQUEST = "wordbook/SET_WORDS_REQUEST";
export const SET_WORDS_SUCCESS = "wordbook/SET_WORDS_SUCCESS";
export const SET_WORDS_FAILURE = "wordbook/SET_WORDS_FAILURE";

export const setPage = createStandardAction(SET_PAGE)<number>();

export const setWordsRequest = createAction(
  SET_WORDS_REQUEST,
  action => (payload: number) => {
    return action(payload);
  }
);

export const setWordsSuccess = createAction(
  SET_WORDS_SUCCESS,
  action => (payload: Word) => {
    return action({
      ...payload
    });
  }
);

export const setWordsFailure = createAction(SET_WORDS_FAILURE, action => () => {
  return action();
});
