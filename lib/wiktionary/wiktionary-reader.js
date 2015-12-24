/**
 * Created by jasondent on 23/12/2015.
 */
var request = require('request');
function fetchWord(lang, word) {
    var params = {
        'action': 'query',
        'prop': 'revisions|info',
        'rvprop': 'content',
        'format': 'json',
        'titles': word
    };
    var uri = 'http://' + lang + '.wiktionary.org/w/api.php?';
    var r = request({
        uri: uri,
        qs: params,
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Modulus homepage.
        }
    });
}
exports.fetchWord = fetchWord;
//# sourceMappingURL=wiktionary-reader.js.map