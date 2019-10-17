import { createReducer } from 'typesafe-actions';
import { PageState, PageAction } from './types';
import { SET_PAGE } from './actions';

const initialState : PageState = {
    id: 'wordbook'
}

const reducer = createReducer<PageState, PageAction>(initialState, {
    [SET_PAGE]: (state, action) => ({ id: action.payload })
})

export default reducer;
