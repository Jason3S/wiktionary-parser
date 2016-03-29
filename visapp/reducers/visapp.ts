/**
 * Created by jasondent on 23/01/2016.
 */

import * as Redux from 'redux';
import { Action, Actions } from '../actions/Actions';
import {ChangePagePayload} from '../actions/Actions';

const initialState: ApplicationState = {
    currentPage: {
        lang: 'en',
        page: 'walk',
        site: 'wiktionary.org'
    },
    ast: {t: 'root', v: 'root'},
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
    return state;
}

function cache(state: AstCache, action: Action): AstCache {
    if (state === undefined) {
        state = initialState.cache;
    }
    return state;
}

export const reducers = {
    currentPage,
    ast,
    cache
};
