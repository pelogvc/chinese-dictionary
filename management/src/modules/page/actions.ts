import { createStandardAction } from 'typesafe-actions';

export const SET_PAGE = 'page/SET_PAGE';

/*
export const setPage = createAction(SET_PAGE, action => (name: string) => {
    return action(name)
})
*/

export const setPage = createStandardAction(SET_PAGE)<string>();