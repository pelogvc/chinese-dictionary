import { createReducer } from "typesafe-actions";
import {
  SET_PAGE,
  SET_COUNT,
  SET_WORDS_SUCCESS,
  SET_WORDS_REQUEST,
  SET_WORDS_FAILURE
} from "./actions";
import { Word, WordbookAction, WordbookState } from "./types";

const initialState: WordbookState = {
  page: 1,
  words: [] as Word[],
  done: true,
  count: 9999
};

const reducer = createReducer<WordbookState, WordbookAction>(initialState, {
  [SET_PAGE]: (state, action) => ({
    ...state,
    page: action.payload
  }),
  [SET_COUNT]: (state, action) => ({
    ...state,
    count: action.payload
  }),
  [SET_WORDS_REQUEST]: state => ({
    ...state,
    words: [],
    done: false
  }),
  [SET_WORDS_SUCCESS]: (state, action) => {
    return {
      ...state,
      words: action.payload,
      done: true
    };
  },
  [SET_WORDS_FAILURE]: state => ({
    ...state,
    done: true
  })
});

export default reducer;
