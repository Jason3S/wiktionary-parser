/**
 * Created by jasondent on 24/12/2015.
 */
var Samples;
(function (Samples) {
    var parserSamples = [
        ['Empty String', ""],
        ['New Line', '\n'],
        ['Empty Lines', '\n\n\n\n\n'],
        ['Single Word', 'Hello'],
        ['Word, New Line', 'Word\n'],
        ['New Line, Word', '\nWord'],
        ['Sentence', 'The quick red fox jumped over the lazy brown dog.'],
        ['Multiple Lines', 'Line 1\nLine 2\nLine 3\nLast Line No EOL'],
        ['Section 1', '= Title ='],
        ['Section 1', ' = Title ='],
        ['Section 1', '= Title = '],
        ['Section 1', '= Title =\nA bit of text.\nSome more\n'],
        ['Multiple Paragraphs', 'Paragraph 1 Line 1.\nParagraph 1 Line 2.\n\nParagraph 2 Line 1.\nParagraph 2 Line 2.\n\n'],
        ['Italics', "''Italics Text''"],
        ['Bold', "'''Bold'''"],
        ['Bold Italics', "'''''Bold Italics'''''"],
        ['Italics(Bold Text)', "'''''Bold Italics''' Italics''"],
        ['Bold(Italics Text)', "'''''Italics Bold'' Bold'''"],
        ['Bold(Italics Text Italics)', "'''''Italics Bold'' Bold ''Italics Bold'''''"],
    ];
    function getParserSamples() {
        return parserSamples;
    }
    Samples.getParserSamples = getParserSamples;
})(Samples = exports.Samples || (exports.Samples = {}));
//# sourceMappingURL=samples.js.map