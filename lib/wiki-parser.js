/**
 * Created by jasondent on 02/01/2016.
 */
var wiktionary = require('../jison/wiktionary');
function parse(text) {
    return wiktionary.parse(text);
}
exports.parse = parse;
//# sourceMappingURL=wiki-parser.js.map