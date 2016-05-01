/**
 * Created by jasondent on 04/01/2016.
 */

import * as chai from 'chai';
import * as wikiTemplateParser from '../jison/wiki';
import * as samples from '../sample-data/samples';
import * as wikiAst from '../jison/WikiAst';

const parserSamples = samples.getTemplateSamples();

const { assert } = chai;

const debug = false;

function log(...args: any[]) {
    if (debug) {
        console.log.apply(null, args);
    }
}

describe('Wiktionary', function () {
    describe('Parsing', function () {
        parserSamples.forEach(function(test) {
            const [name, testDef, expected] = test;
            const [text, page, params] = testDef;
            const regExTests = expected;

            it('should parse: ' + name, function () {
                log('\nTesting ' + name + ': ' + JSON.stringify(text) + '\n');
                const ast = wikiTemplateParser.parse(text);
                console.log(JSON.stringify(text));
                console.log(JSON.stringify(ast));
                const wast = wikiAst.convertAst(ast);
                const result = wikiTemplateParser.processWikiTemplate(page, params as string[], ast);
                log(result + '\n');

                const wResult = wast.eval({page: page, params: params, isTranscluded: true});

                assert.equal(wResult, result, 'Match AST results');

                regExTests.forEach(function(regEx){
                    assert.isTrue(regEx.test(result), regEx.toString() + '.test("' + result + '")');
                });
            });
        });
    });

});

