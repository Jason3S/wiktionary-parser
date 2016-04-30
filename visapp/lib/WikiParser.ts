
import * as Rx from 'rx';

import * as _ from 'lodash';
import { Parser, WikiAbstractSyntaxTree } from '../../jison/Wiktionary';
import { fetchWikiMarkup } from './WikiApi';
import { combine } from './StateHelper';

function convertWikiAstToAstModel(wast: WikiAbstractSyntaxTree): AstModel {
    if (! wast) {
        return null;
    }

    function addIds(wast: WikiAbstractSyntaxTree, id: number): { id: number, ast: AstModel } {
        if (! wast) {
            return { id, ast: null };
        }

        const { t, c, v } = wast;
        const r = c ? _.reduce(c, (accum, wast) => {
            const x = addIds(wast, accum.id + 1);
            return { id: x.id, c: [...accum.c, x.ast] };
        }, { id, c: []}) : { id, c: undefined };

        const ast = combine({id, t, v}, { c: r.c });
        return { id: r.id, ast };
    }

    const { ast } = addIds(wast, 0);
    return ast;
}

export class WikiParser {
    constructor() {}

    requestPage(lang: string, page: string, site?: string): Rx.Observable<AstModel> {
        const parser = new Parser();
        return fetchWikiMarkup(lang, page, site)
            .map(markup => parser.parse(markup))
            .map(convertWikiAstToAstModel);
    }
}

