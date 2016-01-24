/**
 * Created by jasondent on 23/01/2016.
 */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./../interfaces.d.ts"/>

// Actions needed to be added in two places:
// 1 as a constant and 2 in the Actions.
const REQUEST_PAGE = 'REQUEST_PAGE';
const APPLY_AST = 'APPLY_AST';

export const Actions = {
    REQUEST_PAGE,
    APPLY_AST
};


interface PayLoad {
}

export interface Action {
    type: string;
    payload: PayLoad;
}

export interface PageRequest extends PayLoad { lang: string, page: string, site: string }
export function requestPage(request: PageRequest) : Action {
    return { type: Actions.REQUEST_PAGE, payload: request };
}


export function applyAst(ast: IAstModel) {
    return { type: Actions.APPLY_AST, payload: ast };
}

