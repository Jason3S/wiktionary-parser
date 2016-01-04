/**
 * Created by jasondent on 04/01/2016.
 */
var assert = require('chai').assert;
var wikiTemplateParser = require('../jison/wiki-template');
var samples = require('../sample-data/samples').Samples;
var parserSamples = samples.getTemplateSamples();

describe('Wiktionary', function () {
    "use strict";

    describe('Parsing', function () {
        parserSamples.forEach(function(test) {
            var name = test[0];
            var callParams = test[1];
            var regExTests = test[2];
            var text = callParams[0];
            var pageName = callParams[1];
            var params = callParams[2];

            it('should parse: ' + name, function () {
                console.log('\nTesting '+name+': '+JSON.stringify(text)+'\n');
                var result = wikiTemplateParser.parse(text, pageName, params);
                console.log(result +'\n');

                regExTests.forEach(function(regEx){
                    assert.isTrue(regEx.test(result), regEx.toString() + '.test("'+result+'")');
                });
            });
        });
    });

});

