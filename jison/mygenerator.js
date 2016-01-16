/**
 * Created by jasondent on 16/01/2016.
 *
 * Generate a .js file from a .jison file.
 */

var Parser = require("jison").Parser;
var fs = require('fs');
var path = require('path');

var filename = './wiktionary.jison';
var source = fs.readFileSync(path.normalize(filename), "utf8");
var moduleName = path.basename(filename, '.jison');
var options = {type: "lalr", moduleType: "commonjs", moduleName: moduleName, moduleMain: function(){}};

var parser = new Parser(source, options);

// generate source, ready to be written to disk
var parserSource = parser.generate(options);

var outFileName = path.basename(filename, '.jison')+'.js';

fs.writeFileSync(outFileName, parserSource);

var x = parserSource;

process.exit();
