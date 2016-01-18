/**
 * Created by jasondent on 23/12/2015.
 */

var _ = require('lodash');
import request = require('request-promise');

export interface IWiktionaryPageRevision {
    contentformat: string; // ex: "text/x-wiki",
    contentmodel: string;  // ex: "wikitext",
    "*": string; // "==English==\n{{wikipedia|walk}}"
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
    query : IWiktionaryQuery;
}

export function fetchWord(lang: string, word: string) {

    var params = {
        'action' : 'query',
        'prop' :   'revisions|info',
        'rvprop' : 'content',
        'format' : 'json',
        'titles' : word
    };

    var uri = 'http://' + lang + '.wiktionary.org/w/api.php?';

    var url = uri + _(params)
            .map(function(value:string, key:string){ return encodeURIComponent(key) + '=' + encodeURIComponent(value); })
            .join('&');

    return request(url);
}
