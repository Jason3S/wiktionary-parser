/**
 * Created by jasondent on 24/01/2016.
 */

import Rx = require('rx')
import _ = require('lodash');
import { IWiktionaryQueryResult } from "../../lib/wiktionary/wiktionary-reader";
import jQuery = require('jquery');

export function fetchWikiMarkup(lang: string, page: string, site: string = 'wiktionary.org' ) : Rx.Observable<string>  {
    var subject = new Rx.Subject<string>();

    var params:Dictionary<string> = {
        action : 'query',
        prop :   'revisions|info',
        rvprop : 'content',
        format : 'json',
        titles : page
    };

    var uri = 'https://' + lang + '.' + site + '/w/api.php?';

    var url = uri + _
            .map(params,function(value:string, key:string){ return encodeURIComponent(key) + '=' + encodeURIComponent(value); })
            .join('&');

    var request = {
        url: url,
        dataType: 'jsonp',
        crossDomain: true
    };

    jQuery.ajax(request).then((result: IWiktionaryQueryResult)=>{
        const pages = _(result.query.pages)
            .filter((p)=>{ return p.title == page && p.pagelanguage==lang;})
            .map((p:any)=>{ return p.revisions; })
            .filter((p)=>{ return p; })
            .map((p:any)=>{ return p[0]; })
            .filter((p)=>{ return p; })
            .map((p:any)=>{ return p['*'];})
            .filter((p)=>{ return p; })
            .value() || [];
        const markup = pages[0] || '';
        subject.onNext(markup);
        subject.onCompleted();
    });

    return subject;
}