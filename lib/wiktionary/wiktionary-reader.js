/**
 * Created by jasondent on 23/12/2015.
 */
var _ = require('lodash');
var request = require('request-promise');
function fetchWord(lang, word) {
    var params = {
        'action': 'query',
        'prop': 'revisions|info',
        'rvprop': 'content',
        'format': 'json',
        'titles': word
    };
    var uri = 'http://' + lang + '.wiktionary.org/w/api.php?';
    var url = uri + _(params)
        .map(function (value, key) { return encodeURIComponent(key) + '=' + encodeURIComponent(value); })
        .join('&');
    return request(url);
}
exports.fetchWord = fetchWord;
//# sourceMappingURL=wiktionary-reader.js.map