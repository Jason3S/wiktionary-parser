/**
 * Created by jasondent on 23/12/2015.
 */

import request = require('request');

export function fetchWord(lang: string, word: string) {

    var params = {
        'action' : 'query',
        'prop' :   'revisions|info',
        'rvprop' : 'content',
        'format' : 'json',
        'titles' : word
    };

    var uri = 'http://' + lang + '.wiktionary.org/w/api.php?';

    var r = request(
        {
            uri : uri,
            qs: params,
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body); // Show the HTML for the Modulus homepage.
            }
        });

}
