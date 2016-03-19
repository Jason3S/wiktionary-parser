/**
 * Created by jasondent on 23/01/2016.
 */

// Actions needed to be added in two places:
// 1 as a constant and 2 in the Actions.

export const Actions = {
    REQUEST_PAGE: 'REQUEST_PAGE',
    APPLY_AST: 'APPLY_AST',
    REQUEST_PAGE_READY: 'REQUEST_PAGE_READY'
};


interface PayLoad {
}

export interface Action {
    type: string;
    payload: PayLoad;
}

export interface PageRequest extends PayLoad { lang: string, page: string, site: string }
export function requestPage(payload: PageRequest) : Action {
    return { type: Actions.REQUEST_PAGE, payload };
}


export interface  RequestPageReady extends PayLoad { lang: string, page: string, site: string, ast: AstModel }
export function requestPageReady(payload: RequestPageReady) : Action {
    return { type: Actions.REQUEST_PAGE_READY, payload };
}

export function applyAst() {
    return { type: Actions.APPLY_AST, payload:{} };
}

