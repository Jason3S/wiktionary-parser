/**
 * Created by jasondent on 04/01/2016.
 */

import * as chai from 'chai';
import {wikiParser, processWikiTemplate} from '../jison/wiki';
import * as samples from '../sample-data/samples';
import * as wikiAst from '../jison/WikiAst';

import * as prettyjson from 'prettyjson';
import * as jsonSelect from 'JSONSelect';
import * as jsonPath from 'jsonpath';

const parserSamples = samples.getTemplateSamples();
const markupSamples = samples.getParserSamples();

const { assert } = chai;

const debug = false;

function log(...args: any[]) {
    if (debug) {
        console.log.apply(null, args);
    }
}

describe('Wiktionary', function () {
    describe('Parsing Templates', function () {
        parserSamples.forEach(function(test) {
            const [name, testDef, expected] = test;
            const [text, page, params] = testDef;
            const regExTests = expected;

            it('should parse: ' + name, function () {
                log('\nTesting ' + name + ': ' + JSON.stringify(text) + '\n');
                const ast = wikiParser.parse(text);
                console.log(JSON.stringify(text));
                console.log(prettyjson.render(ast) + '\n');
                const wast = wikiAst.convertAst(ast);
                const result = processWikiTemplate(page, params as string[], ast);
                log(result + '\n');

                const wResult = wast.eval({page: page, params: params, isTranscluded: true});

                assert.equal(wResult, result, 'Match AST results');

                regExTests.forEach(function(regEx){
                    assert.isTrue(regEx.test(result), regEx.toString() + '.test("' + result + '")');
                });
            });
        });
    });

    describe('Parsing Markup', function () {
        const samples = markupSamples.slice(0, 0);
        samples.forEach(function(test) {
            const [name, text, tests] = test;

            it('should parse: ' + name, function () {
                console.log('\nTesting ' + name + ': ' + JSON.stringify(text) + '\n');
                const ast = wikiParser.parse(text);
                console.log(prettyjson.render(ast) + '\n');

                assert.isObject(ast, 'Test Parses to Object: "' + text.substr(0, 20) + '"');

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
});

