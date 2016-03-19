/**
 * Created by jasondent on 23/12/2015.
 */

import * as _ from 'lodash';
require('isomorphic-fetch');
require('whatwg-fetch');

export interface IWiktionaryPageRevision {
    contentformat: string; // ex: "text/x-wiki",
    contentmodel: string;  // ex: "wikitext",
    '*': string; // "==English==\n{{wikipedia|walk}}"
}

export interface IWiktionaryPage {
    pageid: number;
    ns: number; // namespace
    title: string;
    revisions: IWiktionaryPageRevision[];
    contentmodel: string; // ex: "wikitext",
    pagelanguage: string; // ex: "en",
    pagelanguagehtmlcode: string; // ex: "en",
    pagelanguagedir: string; // ex: "ltr",
    touched: string; // ex: "2016-01-17T18:55:09Z",
    lastrevid: number; // ex: 36262557,
    length: number; // ex: 27727
}

export interface IWiktionaryQuery {
    pages: { [index: string]: IWiktionaryPage };
}

export interface IWiktionaryQueryResult {
    batchcomplete: string;
    query: IWiktionaryQuery;
}

export function fetchWord(lang: string, word: string) {

    const params = {
        'action' : 'query',
        'prop' :   'revisions|info',
        'rvprop' : 'content',
        'format' : 'json',
        'titles' : word
    };

    const uri = 'http://' + lang + '.wiktionary.org/w/api.php?';

    const url = uri + _(params)
            .map((value: string, key: string) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
            .join('&');

    return fetch(url);
}
