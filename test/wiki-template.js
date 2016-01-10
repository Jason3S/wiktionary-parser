/**
 * Created by jasondent on 04/01/2016.
 */
var assert = require('chai').assert;
var wikiTemplateParser = require('../jison/wiki-template');
var samples = require('../sample-data/samples').Samples;
var parserSamples = samples.getTemplateSamples();
var wikiAst = require('../jison/WikiAst').WikiAst;

describe('Wiktionary', function () {
    "use strict";

    describe('Parsing', function () {
        parserSamples.forEach(function(test) {
            var name = test[0];
            var text = test[1][0];
            var page = test[1][1];
            var params = test[1][2];
            var regExTests = test[2];

            it('should parse: ' + name, function () {
                console.log('\nTesting '+name+': '+JSON.stringify(text)+'\n');
                var ast = wikiTemplateParser.parse(text);
                var wast = wikiAst.convertAst(ast);
                var result = wikiTemplateParser.parser.processWikiTemplate(page, params, ast);
                console.log(result +'\n');

                var wResult = wast.eval({page: page, params: params, isTranscluded: true});

                assert.equal(wResult, result, "Match AST results");

                regExTests.forEach(function(regEx){
                    assert.isTrue(regEx.test(result), regEx.toString() + '.test("'+result+'")');
                });
            });
        });
    });

});

