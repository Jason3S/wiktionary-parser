/**
 * Created by jasondent on 24/12/2015.
 */
var Samples;
(function (Samples) {
    var parserSamples = [
        ['Empty String', ""],
        ['New Line', '\n'],
        ['Single Word', 'Hello'],
        ['Word, New Line', 'Word\n'],
        ['New Line, Word', '\nWord'],
        ['Sentence', 'The quick red fox jumped over the lazy brown dog.'],
        ['Multiple Lines', 'Line 1\nLine 2\nLine 2\n'],
    ];
    function getParserSamples() {
        return parserSamples;
    }
    Samples.getParserSamples = getParserSamples;
})(Samples = exports.Samples || (exports.Samples = {}));
//# sourceMappingURL=samples.js.map