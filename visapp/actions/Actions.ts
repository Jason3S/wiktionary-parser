/**
 * Created by jasondent on 23/01/2016.
 */

// Actions needed to be added in two places:
// 1 as a constant and 2 in the Actions.

export const Actions = {
    CHANGE_PAGE: 'CHANGE_PAGE',
    REQUEST_PAGE: 'REQUEST_PAGE',
    APPLY_AST: 'APPLY_AST',
    REQUEST_PAGE_READY: 'REQUEST_PAGE_READY'
};


export interface PayLoad {
}

export interface Action {
    type: string;
    payload: PayLoad;
}

export interface ChangePagePayload extends PayLoad, AstQuery {}
export function changePage(payload: ChangePagePayload): Action {
    return { type: Actions.CHANGE_PAGE, payload };
}

export interface RequestPagePayload extends PayLoad, AstQuery {}
export interface RequestPageAction extends Action { payload: RequestPagePayload; }
export const isRequestPageAction = genIsAction<RequestPageAction>(Actions.REQUEST_PAGE);
export function requestWikiPage(payload: RequestPagePayload): RequestPageAction {
    return { type: Actions.REQUEST_PAGE, payload };
}

export interface RequestedPageReady extends PayLoad { lang: string; page: string; site?: string; ast: AstModel; }
export interface RequestedPageReadyAction extends Action { payload: RequestedPageReady; }
export function requestedPageReady(payload: RequestedPageReady): RequestedPageReadyAction {
    return { type: Actions.REQUEST_PAGE_READY, payload };
}

export interface ApplyAstPayload extends PayLoad, AstModel {}
export interface ApplyAstAction extends Action { payload: ApplyAstPayload; }
export const isApplyAstAction = genIsAction<ApplyAstAction>(Actions.APPLY_AST);
export function applyAst(astModel: AstModel): ApplyAstAction {
    return { type: Actions.APPLY_AST, payload: astModel };
}

function isAction<T extends Action>(action: Action, type: string): action is T { return action.type === type; }
function genIsAction<T extends Action>(type: string) {
    return (action: Action): action is T => isAction<T>(action, type);
}
