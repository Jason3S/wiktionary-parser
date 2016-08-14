/**
 * Created by jasondent on 24/01/2016.
 */

import * as Rx from 'rx';
import * as _ from 'lodash';
import { IWiktionaryQueryResult } from '../../lib/wiktionary/wiktionary-reader';
import isNode = require('detect-node');
import * as fetch from 'isomorphic-fetch';
import { Dictionary } from 'lodash';

const defaultWikiSite = 'wiktionary.org';

function fetchUrl<T>(url): Promise<T> {
    if (isNode) {
        return fetch(url).then(response => response.json());
    }

    const jQuery = require('jquery');

    // Use Jquery.
    const request = {
        url: url,
        dataType: 'jsonp',
        crossDomain: true
    };

    return new Promise((resolve, reject) => {
        jQuery.ajax(request).then(resolve, reject);
    });
}

export function fetchWikiMarkup(lang: string, page: string, site: string = defaultWikiSite ): Rx.Observable<string>  {
    const params: Dictionary<string> = {
        action : 'query',
        prop :   'revisions|info',
        rvprop : 'content',
        format : 'json',
        titles : page
    };

    const uri = 'https://' + lang + '.' + site + '/w/api.php?';

    const url = uri + _
            .map(params, (value: string, key: string) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
            .join('&');

    return Rx.Observable.fromPromise(fetchUrl(url))
        .flatMap((result: IWiktionaryQueryResult) => Rx.Observable.pairs(result.query.pages))
        .map(kvp => kvp[1])
        .filter(p => p.title === page && p.pagelanguage === lang)
        .flatMap(p => p.revisions)
        .map(p => p['*'])
        .first()
        .share()
        ;
}
