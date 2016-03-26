/**
 * Created by jasondent on 04/01/2016.
 */

import * as chai from 'chai';
import * as wikiTemplateParser from '../jison/wiki-template';
import * as samples from '../sample-data/samples';
import * as wikiAst from '../jison/WikiAst';

const parserSamples = samples.getTemplateSamples();

const { assert } = chai;

describe('Wiktionary', function () {
    describe('Parsing', function () {
        parserSamples.forEach(function(test) {
            const [name, testDef, expected] = test;
            const [text, page, params] = testDef;
            const regExTests = expected;

            it('should parse: ' + name, function () {
                console.log('\nTesting ' + name + ': ' + JSON.stringify(text) + '\n');
                const ast = wikiTemplateParser.parse(text);
                const wast = wikiAst.convertAst(ast);
                const result = wikiTemplateParser.parser.processWikiTemplate(page as string, params as string[], ast);
                console.log(result + '\n');

                const wResult = wast.eval({page: page, params: params, isTranscluded: true});

                assert.equal(wResult, result, 'Match AST results');

                regExTests.forEach(function(regEx){
                    assert.isTrue(regEx.test(result), regEx.toString() + '.test("' + result + '")');
                });
            });
        });
    });

});

