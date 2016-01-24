/**
 * Created by jasondent on 23/01/2016.
 */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./../interfaces.d.ts"/>

import { Action, Actions } from '../actions/Actions';

interface State {
    query: IAstQuery;
    activeAst: IAstTree;
    astCache: IAstCache;
}

const initialState : State = {
    query: {
        lang: 'en',
        word: 'hello',
        site: 'wiktionary.org'
    },
    activeAst: null,
    astCache: {}
};


function visApp(state: State, action: Action): State {
    return state;
}
