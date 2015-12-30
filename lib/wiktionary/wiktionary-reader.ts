/**
 * Created by jasondent on 23/12/2015.
 */

var _ = require('lodash');
import request = require('request-promise');

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
