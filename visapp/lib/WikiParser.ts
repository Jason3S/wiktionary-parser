
import * as Rx from 'rx';

import * as Wiktionary from '../../jison/Wiktionary';
import { fetchWikiMarkup } from './WikiApi';

export class WikiParser {
    constructor() {}

    requestPage(lang: string, page: string, site?: string): Rx.Observable<AstModel> {
        const parser = new Wiktionary.Parser();
        return fetchWikiMarkup(lang, page, site)
            .map(markup => parser.parse(markup));
    }
}

