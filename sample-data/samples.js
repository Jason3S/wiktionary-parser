var fs_1 = require("fs");
/**
 * Created by jasondent on 24/12/2015.
 */
var Samples;
(function (Samples) {
    var parserSamples = [
        ['Empty String', "", [{ s: '.t', jp: '$..t', e: ['wiki-page', 'eof'] }]],
        ['New Line', '\n', [{ s: '.t', jp: '$..t', e: ['wiki-page', 'article', 'paragraphs', 'paragraph', 'blank-line', 'eof'] }]],
        ['Empty Lines', '\n\n\n\n\n', [{ s: '.t:val("blank-line")', jp: '$..[?(@.t=="blank-line")].t', e: ['blank-line', 'blank-line', 'blank-line', 'blank-line', 'blank-line'] }]],
        ['Single Word', 'Hello', [{ s: '.t:val("plain-text") ~ .v', jp: '$..[?(@.t=="plain-text")].v', e: ['Hello'] }]],
        ['Word, New Line', 'Word\n'],
        ['New Line, Word', '\nWord'],
        ['Sentence', 'The quick red fox jumped over the lazy brown dog.'],
        ['Multiple Lines', 'Line 1\nLine 2\nLine 3\nLast Line No EOL'],
        ['Section 1', '= Title ='],
        ['Section 1', ' = Title ='],
        ['Section 1', '= Title = '],
        ['Section 1', '= Title =\nA bit of text.\nSome more\n'],
        ['Section 2', '== Title =='],
        ['Section 3', '=== Title ==='],
        ['Section 4', '==== Title ===='],
        ['Section 5', '===== Title ====='],
        ['Section 2', '== Title ==\ntext'],
        ['Section 3', '=== Title ===\ntext'],
        ['Section 4', '==== Title ====\ntext'],
        ['Section 5', '===== Title =====\ntext'],
        ['Multiple Paragraphs', 'Paragraph 1 Line 1.\nParagraph 1 Line 2.\n\nParagraph 2 Line 1.\nParagraph 2 Line 2.\n\n'],
        ['Italics', "''Italics Text''"],
        ['Bold', "'''Bold'''"],
        ['Bold Italics', "'''''Bold Italics'''''"],
        ['Italics(Bold Text)', "'''''Bold Italics''' Italics''"],
        ['Bold(Italics Text)', "'''''Italics Bold'' Bold'''"],
        ['Bold(Italics Text Italics)', "'''''Italics Bold'' Bold ''Italics Bold'''''"],
        ['Unicode Escape Sequence', "\\u0584\\u0561\\u0575", [{ jp: '$..v', e: ['\u0584\u0561\u0575'] }]],
        ['Section 2', '== Section 2 ==\nA bit of text.\nSome more\n'],
        ['Section 1,2', '= Title =\n== Section 2==\nA bit of text.\nSome more\n'],
        ['Section 1,2', '= Title =\nInfo.\n== Section 2==\nA bit of text.\nSome more\n'],
        ['Section 1,2,3,2', "\n= Section 1 =\nA bit about the title\n== Section 1.1 ==\nA bit of text.\n=== Section 1.1.1 ===\nSome more\n== Section 1.2 ==\n== Section 1.3 ==\n=== Section 1.3.1 ===\n== Section 1.4 ==\n==== Section 1.4..1 ====\n''Some text''.\n\n"],
        ['Simple Link', '[[a|b]]', [{ jp: '$..[?(@.t=="link")]..v', e: ['a', 'b'] }]],
        ['Simple Link', '[[a]]', [{ jp: '$..[?(@.t=="link")]..v', e: ['a'] }]],
        ['Simple Link', '[[Image:Muybridge horse walking animated.gif|thumb|right|A horse walking.]]', [{ jp: '$..[?(@.t=="link")]..v', e: ['Image:Muybridge horse walking animated.gif', 'thumb', 'right', 'A horse walking.'] }]],
    ];
    function getParserSamples() {
        return parserSamples;
    }
    Samples.getParserSamples = getParserSamples;
    function readSampleFileWiktionaryEnHouse() {
        return fs_1.readFileSync('./sample-data/wiktionary-en-house.wm', 'utf8');
    }
    Samples.readSampleFileWiktionaryEnHouse = readSampleFileWiktionaryEnHouse;
})(Samples = exports.Samples || (exports.Samples = {}));
//# sourceMappingURL=samples.js.map