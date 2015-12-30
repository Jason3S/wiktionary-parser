import {readFileSync} from "fs";
/**
 * Created by jasondent on 24/12/2015.
 */

export module Samples {
    var parserSamples:any[][] = [
        ['Empty String', ``, [{s:'.t', e: ['wiki-page', 'eof']}]],
        ['New Line', '\n', [{s:'.t', e: ['wiki-page', 'article', 'paragraphs', 'paragraph', 'blank-line', 'eof']}]],
        ['Empty Lines', '\n\n\n\n\n', [{s:'.t:val("blank-line")', e: ['blank-line', 'blank-line', 'blank-line', 'blank-line', 'blank-line']}]],
        ['Single Word', 'Hello', [{s:'.t:val("plain-text") ~ .v', e: ['Hello']}]],
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
        ['Italics', `''Italics Text''`],
        ['Bold', "'''Bold'''"],
        ['Bold Italics', "'''''Bold Italics'''''"],
        ['Italics(Bold Text)', "'''''Bold Italics''' Italics''"],
        ['Bold(Italics Text)', "'''''Italics Bold'' Bold'''"],
        ['Bold(Italics Text Italics)', "'''''Italics Bold'' Bold ''Italics Bold'''''"],
        ['Section 2', '== Section 2 ==\nA bit of text.\nSome more\n'],
        ['Section 1,2', '= Title =\n== Section 2==\nA bit of text.\nSome more\n'],
        ['Section 1,2', '= Title =\nInfo.\n== Section 2==\nA bit of text.\nSome more\n'],
        ['Section 1,2,3,2', `
= Section 1 =
A bit about the title
== Section 1.1 ==
A bit of text.
=== Section 1.1.1 ===
Some more
== Section 1.2 ==
== Section 1.3 ==
=== Section 1.3.1 ===
== Section 1.4 ==
==== Section 1.4..1 ====
''Some text''.

`],
    ];

    export function getParserSamples() {
        return parserSamples;
    }

    export function readSampleFileWiktionaryEnHouse() {
        return readFileSync('./sample-data/wiktionary-en-house.wm', 'utf8');
    }
}