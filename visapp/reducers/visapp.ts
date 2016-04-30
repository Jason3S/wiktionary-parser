/**
 * Created by jasondent on 23/01/2016.
 */

import * as Redux from 'redux';
import { Action, Actions, isApplyAstAction } from '../actions/Actions';
import {ChangePagePayload} from '../actions/Actions';
import {isRequestPageAction} from '../actions/Actions';
import {hashKeyForQuery, combine} from '../lib/StateHelper';
import * as _ from 'lodash';

const initialState: ApplicationState = {
    currentPage: {
        lang: 'en',
        page: 'walk',
        site: 'wiktionary.org'
    },
    ast: {id: 0, t: 'root', v: 'root'},
    cache: {}
};

interface RouterAction {
    type: string;
    payload: {
        query: {
            lang?: string;
            page?: string;
        }
    };
}

function currentPage(state: AstQuery, action: Action): AstQuery {
    if (state === undefined) {
        state = initialState.currentPage;
    }
    console.log(action);
    switch (action.type) {
        case Actions.CHANGE_PAGE: {
            const payload = action.payload as ChangePagePayload;
            const { lang, page, site } = payload;
            return { lang, site, page };
        }
        case '@@router/LOCATION_CHANGE': {
            const { payload } = action as RouterAction;
            const { query } = payload;
            const { lang, page } = query;
            console.log(query);
            if (lang && page) {
                return _.assign({}, state, { lang, page }) as AstQuery;
            }
        }
    }
    return state;
}

function ast(state: AstModel, action: Action): AstModel {
    if (state === undefined) {
        state = initialState.ast;
    }

    if (isApplyAstAction(action)) {
        return action.payload;
    }

    return state;
}

function cache(state: AstCache, action: Action): AstCache {
    if (state === undefined) {
        state = initialState.cache;
    }

    if (isRequestPageAction(action)) {
        const key = hashKeyForQuery(action.payload);
        if (! state[key]) {
            return combine(state, { [key]: {query: action.payload, ast: null}});
        }
        return state;
    }

    return state;
}

export const reducers = Redux.combineReducers({
    currentPage,
    ast,
    cache
});
