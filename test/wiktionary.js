/**
 * Created by jasondent on 24/12/2015.
 */
var assert = require('chai').assert;
var wiktionary = require('../jison/wiktionary.js');
var prettyjson = require('prettyjson');
var parserSamples = require('../sample-data/samples').Samples.getParserSamples();

describe('Wiktionary', function () {
    describe('Parsing', function () {
        it('should parse sample markup', function () {

            parserSamples.forEach(function(test){
                var name = test[0];
                var text = test[1];
                console.log('\nTesting '+name+': '+JSON.stringify(text)+'\n');
                var ast = wiktionary.parse(text);
                console.log(prettyjson.render(ast)+'\n');
                assert.isObject(ast, 'Test Parses to Object: "'+text.substr(0,20)+'"');
            });

        });

    });
});

