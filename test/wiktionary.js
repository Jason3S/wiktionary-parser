/**
 * Created by jasondent on 24/12/2015.
 */
var assert = require('chai').assert;
var wiktionary = require('../jison/wiktionary.js');
var prettyjson = require('prettyjson');
var jsonSelect = require('JSONSelect');
var jasonPath = require('jsonpath');
var samples = require('../sample-data/samples').Samples;
var parserSamples = samples.getParserSamples();

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

                if (test[2]) {
                    test[2].forEach(function(select){
                        var r;
                        if (select.s) {
                            r = jsonSelect.match(select.s, ast);
                            assert.deepEqual(r, select.e);
                        }
                        if (select.jp) {
                            r = jasonPath.query(ast, select.jp);
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
            console.log(prettyjson.render(ast).substr(0,192)+'\n');
            assert.isObject(ast, 'Test Parses to Object: "'+text.substr(0,20)+'"');
        });

    });
});

