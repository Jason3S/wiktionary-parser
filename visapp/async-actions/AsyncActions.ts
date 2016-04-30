
import { RequestPageAction, Action, requestedPageReady } from '../actions/Actions';
import { applyAst } from '../actions/Actions';
import { hashKeyForQuery, combine } from '../lib/StateHelper';
import { WikiParser } from '../lib/WikiParser';

type Dispatch = (action: Action) => any;
type GetState = () => ApplicationState;

export function requestPageAync(action: RequestPageAction) {
    return (dispatch: Dispatch, getState: GetState) => {
        const state = getState();
        const pageHash = hashKeyForQuery(action.payload);

        if (!state.cache[pageHash]) {
            dispatch(action);
            const wikiParser = new WikiParser();
            const { lang, page, site } = action.payload;
            wikiParser.requestPage(lang, page, site)
                .subscribe(ast => {
                    dispatch(applyAst(ast));
                });
        }

    };
}