/**
 * Created by jasondent on 24/12/2015.
 */

export module Samples {
    var parserSamples:string[][] = [
        ['Empty String', ``],
        ['New Line', '\n'],
        ['Single Word', 'Hello'],
        ['Word, New Line', 'Word\n'],
        ['New Line, Word', '\nWord'],
        ['Sentence', 'The quick red fox jumped over the lazy brown dog.'],
        ['Multiple Lines', 'Line 1\nLine 2\nLine 2\n'],
    ];

    export function getParserSamples() {
        return parserSamples;
    }
}