var fs_1 = require("fs");
/**
 * Created by jasondent on 24/12/2015.
 */
var Samples;
(function (Samples) {
    var parserSamples = [
        ['Numbered List', "# a\n# b\n# c\n\n", [
                { jp: '$..[?(@.t=="ordered-list")].t', e: ["ordered-list"] },
                { jp: '$..[?(@.t=="list-item")].t', e: ["list-item", "list-item", "list-item"] },
            ]],
        ['Numbered List EOF', "# a\n# b\n# c", [
                { jp: '$..[?(@.t=="ordered-list")].t', e: ["ordered-list"] },
                { jp: '$..[?(@.t=="list-item")].t', e: ["list-item", "list-item", "list-item"] },
            ]],
        ['Italics(Text, Bold, Text)', "'' Text '''Bold''' Text''", [
                { jp: '$..[?(@.t=="bold-text")].t', e: ["bold-text"] },
                { jp: '$..[?(@.t=="italic-text")].t', e: ["italic-text"] },
                { jp: '$..[?(@.t=="bold-text")]..v', e: ["Bold"] },
                { jp: '$..[?(@.t=="italic-text")]..v', e: [' Text ', 'Bold', ' Text'] },
            ]],
        ['Bold(Text, Italics, Text)', "''' Text ''Italics'' Text'''", [
                { jp: '$..[?(@.t=="bold-text")].t', e: ["bold-text"] },
                { jp: '$..[?(@.t=="italic-text")].t', e: ["italic-text"] },
                { jp: '$..[?(@.t=="bold-text")]..v', e: [' Text ', 'Italics', ' Text'] },
                { jp: '$..[?(@.t=="italic-text")]..v', e: ['Italics'] },
            ]],
        ['Italics(Bold Text)', "'''''Bold Italics''' Italics''", [
                { jp: '$..[?(@.t=="bold-text")].t', e: ["bold-text"] },
                { jp: '$..[?(@.t=="italic-text")].t', e: ["italic-text"] },
                { jp: '$..[?(@.t=="bold-text")]..v', e: ["Bold Italics"] },
                { jp: '$..[?(@.t=="italic-text")]..v', e: ["Bold Italics", ' Italics'] },
            ]],
        ['Italics', "''Italics Text''", [
                { jp: '$..v', e: ["Italics Text"] },
                { jp: '$..[?(@.t=="italic-text")]..v', e: ["Italics Text"] },
            ]],
        ['Bold', "'''Bold'''", [
                { jp: '$..[?(@.t=="bold-text")]..v', e: ["Bold"] },
            ]],
        ['Bold Italics', "'''''Bold Italics'''''", [
                { jp: '$..[?(@.t=="bold-text")].t', e: ["bold-text"] },
                { jp: '$..[?(@.t=="italic-text")].t', e: ["italic-text"] },
            ]],
        ['Bold(Italics Text)', "'''''Italics Bold'' Bold'''", [
                { jp: '$..[?(@.t=="bold-text")].t', e: ["bold-text"] },
                { jp: '$..[?(@.t=="italic-text")].t', e: ["italic-text"] },
                { jp: '$..[?(@.t=="bold-text")]..v', e: ["Italics Bold", ' Bold'] },
                { jp: '$..[?(@.t=="italic-text")]..v', e: ["Italics Bold"] },
            ]],
        ['Bold(Italics Text Italics)', "'''''Italics Bold'' Bold ''Italics Bold'''''", [
                { jp: '$..[?(@.t=="bold-text")].t', e: ["bold-text"] },
                { jp: '$..[?(@.t=="italic-text")].t', e: ["italic-text", "italic-text"] },
                { jp: '$..[?(@.t=="bold-text")]..v', e: ["Italics Bold", ' Bold ', "Italics Bold"] },
                { jp: '$..[?(@.t=="italic-text")]..v', e: ["Italics Bold", "Italics Bold"] },
            ]],
        ['Italics(Bold Text Bold)', "'''''Italics Bold''' Italics '''Italics Bold'''''", [
                { jp: '$..[?(@.t=="bold-text")].t', e: ["bold-text", "bold-text"] },
                { jp: '$..[?(@.t=="italic-text")].t', e: ["italic-text"] },
                { jp: '$..[?(@.t=="italic-text")]..v', e: ["Italics Bold", ' Italics ', "Italics Bold"] },
                { jp: '$..[?(@.t=="bold-text")]..v', e: ["Italics Bold", "Italics Bold"] },
            ]],
        ['Italics(Bold Text Bold)', "'''''Italics Bold''' Italics '''Bold''' Italics '''Italics Bold'''''", [
                { jp: '$..[?(@.t=="bold-text")].t', e: ["bold-text", "bold-text", "bold-text"] },
                { jp: '$..[?(@.t=="italic-text")].t', e: ["italic-text"] },
                { jp: '$..[?(@.t=="italic-text")]..v', e: ["Italics Bold", ' Italics ', 'Bold', ' Italics ', "Italics Bold"] },
                { jp: '$..[?(@.t=="bold-text")]..v', e: ["Italics Bold", 'Bold', "Italics Bold"] },
            ]],
        ['Bold Trailing Quote', "'''Bold''''", [
                { jp: '$..[?(@.t=="bold-text")].t', e: ["bold-text"] },
                { jp: '$..[?(@.t=="bold-text")]..v', e: ["Bold'"] },
            ]],
        ['Bold Leading Quote', "''''Bold'''", [
                { jp: '$..[?(@.t=="bold-text")].t', e: ["bold-text"] },
                { jp: '$..[?(@.t=="bold-text")]..v', e: ["Bold"] },
                { jp: '$..v', e: ["'", "Bold"] },
            ]],
        ['Bold Extra Quotes', "''''Bold''''", [
                { jp: '$..[?(@.t=="bold-text")].t', e: ["bold-text"] },
                { jp: '$..[?(@.t=="bold-text")]..v', e: ["Bold'"] },
                { jp: '$..v', e: ["'", "Bold'"] },
            ]],
        ['Single Quote', "how's", []],
        ['No Wiki', "<nowiki>''text''</nowiki>''text''", [
                { jp: '$..v', e: ["''text''", "text"] },
            ]],
        ['No Wiki', "<nowiki>==text==</nowiki>''text''", [
                { jp: '$..v', e: ["==text==", "text"] },
            ]],
        ['Empty String', "", [{ jp: '$..t', e: ['wiki-page', 'eof'] }]],
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
        ['Unicode Escape Sequence', "\\u0584\\u0561\\u0575", [{ jp: '$..v', e: ['\u0584\u0561\u0575'] }]],
        ['Section 2', '== Section 2 ==\nA bit of text.\nSome more\n'],
        ['Section 1,2', '= Title =\n== Section 2==\nA bit of text.\nSome more\n'],
        ['Section 1,2', '= Title =\nInfo.\n== Section 2==\nA bit of text.\nSome more\n'],
        ['Section 1,2,3,2', "\n= Section 1 =\nA bit about the title\n== Section 1.1 ==\nA bit of text.\n=== Section 1.1.1 ===\nSome more\n== Section 1.2 ==\n== Section 1.3 ==\n=== Section 1.3.1 ===\n== Section 1.4 ==\n==== Section 1.4..1 ====\n''Some text''.\n\n"],
        ['Simple Link', '[[a|b]]', [{ jp: '$..[?(@.t=="link")]..v', e: ['a', 'b'] }]],
        ['Simple Link', '[[a]]', [{ jp: '$..[?(@.t=="link")]..v', e: ['a'] }]],
        ['Simple Link', '[[Image:Muybridge horse walking animated.gif|thumb|right|A horse walking.]]', [{ jp: '$..[?(@.t=="link")]..v', e: ['Image:Muybridge horse walking animated.gif', 'thumb', 'right', 'A horse walking.'] }]],
        ['Simple Template', "{{qualifier|long walk}}", [
                { jp: '$..[?(@.t=="template")]..v', e: ['qualifier', 'long walk'] },
                { jp: '$..[?(@.t=="template-name")]..v', e: ['qualifier'] },
                { jp: '$..[?(@.t=="template-param")]..v', e: ['long walk'] },
            ]],
        ['Translation Template', "{{t+|ca|passeig|m}}", [
                { jp: '$..[?(@.t=="template")]..v', e: ['t+', 'ca', 'passeig', 'm'] },
                { jp: '$..[?(@.t=="template-name")]..v', e: ['t+'] },
                { jp: '$..[?(@.t=="template-param")]..v', e: ['ca', 'passeig', 'm'] },
            ]],
    ];
    function getParserSamples() {
        return parserSamples;
    }
    Samples.getParserSamples = getParserSamples;
    function getTemplateSamples() {
        return [
            ['#expr: 5', ['{{ #expr: 5}}', 'Page1', []], [/^5$/]],
            ['#expr: 5+8/2', ['{{ #expr: 5+8/2 }}', 'Page1', []], [/^9$/]],
            ['Basic Template', ['text', 'Page1', []], [/^text$/]],
            ['Param 1 missing', ['{{{1|}}}', 'Page1', []], [/^Page1$/]],
            ['Param 1 missing with default', ['{{{1|happy}}}', 'Page1', []], [/^happy$/]],
            ['Param 1 exists', ['{{{1|}}}', 'Page1', ['a', 'b']], [/^a$/]],
            ['Param 1 named', ['{{{1|}}}', 'Page1', ['a', '1=b']], [/^b$/]],
            ['#if false', ['{{ #if: {{{1}}}|yes|no}}', 'Page1', []], [/^no$/]],
            ['#if 0', ['{{ #if: {{{1}}}|yes|no}}', 'Page1', []], [/^no$/]],
            ['#if true', ['{{#if: {{{1}}}|yes|no}}', 'Page1', [1]], [/^yes$/]],
        ];
    }
    Samples.getTemplateSamples = getTemplateSamples;
    function readSampleFileWiktionaryEnHouse() {
        return fs_1.readFileSync('./sample-data/wiktionary-en-house.wm', 'utf8');
    }
    Samples.readSampleFileWiktionaryEnHouse = readSampleFileWiktionaryEnHouse;
})(Samples = exports.Samples || (exports.Samples = {}));
//# sourceMappingURL=samples.js.map