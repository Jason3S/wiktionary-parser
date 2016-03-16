/**
 * Created by jasondent on 23/01/2016.
 */

import { Action, Actions } from '../actions/Actions';
import wikiParser = require('../../lib/wiki-parser');
import jQuery = require('jquery');
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




function currentPage(state: IAstQuery, action: Action): IAstQuery {
    if (state === undefined) {
        state = initialState.currentPage;
    }
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

function ast(state: IAstModel, action: Action): IAstModel {
    if (state === undefined) {
        state = initialState.ast;
    }
    return state;
}

function cache(state: IAstCache, action: Action): IAstCache {
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
