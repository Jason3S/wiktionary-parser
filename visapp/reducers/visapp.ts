/**
 * Created by jasondent on 23/01/2016.
 */

import * as Redux from 'redux';
import { Action, Actions } from '../actions/Actions';
import {PageRequest} from '../actions/Actions';

const initialState: ApplicationState = {
    currentPage: {
        lang: 'en',
        word: 'walk',
        site: 'wiktionary.org'
    },
    ast: {t: 'root', v: 'root'},
    cache: {}
};




function currentPage(state: AstQuery, action: Action): AstQuery {
    if (state === undefined) {
        state = initialState.currentPage;
    }
    console.log(action);
    switch (action.type) {
        case Actions.REQUEST_PAGE:
        {
            const payload = action.payload as PageRequest;
            const { lang, page, site } = payload;
            return { lang, site, word: page }
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
