/**
 * Created by jasondent on 24/12/2015.
 */

import * as chai from 'chai';
import * as wiktionary from '../jison/wiktionary';
import * as samples from '../sample-data/samples';
import * as wikiAst from '../lib/wiki-ast';

const parserSamples = samples.getParserSamples();

import * as prettyjson from 'prettyjson';
import * as jsonSelect from 'JSONSelect';
import * as jsonPath from 'jsonpath';

const { assert } = chai;

describe('Wiktionary', function () {
    describe('Parsing', function () {
        parserSamples.forEach(function(test) {
            const [name, text, tests] = test;

            it('should parse: ' + name, function () {
                console.log('\nTesting ' + name + ': ' + JSON.stringify(text) + '\n');
                const ast = wiktionary.parse(text);
                console.log(prettyjson.render(ast) + '\n');

                assert.isObject(ast, 'Test Parses to Object: "' + text.substr(0, 20) + '"');
                assert.isTrue(wikiAst.validateWikiAbstractSyntaxTree(ast), 'Validate Tree');

                if (tests) {
                    tests.forEach(function(select){
                        if (select.s) {
                            const r = jsonSelect.match(select.s, ast);
                            assert.deepEqual(r, select.e);
                        }
                        if (select.jp) {
                            const r = jsonPath.query(ast, select.jp);
                            assert.deepEqual(r, select.e);
                        }
                    });
                }
            });
        });
    });

    describe('Parsing Mark Up Files', function () {
        it('should parse sample markup files', function () {

            var text = samples.readSampleFileWiktionaryEnHouse();

            console.log('Parse Wiktionary En House \n');
            var ast = wiktionary.parse(text);
            console.log(prettyjson.render(ast).substr(0,192) + '\n');
            assert.isObject(ast, 'Test Parses to Object: "' + text.substr(0,20) + '"');
        });

    });
});

