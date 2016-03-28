/**
 * Created by jasondent on 16/01/2016.
 *
 * Generate a .js file from a .jison file.
 */

import {Parser, ParserOptions} from 'jison';
import * as fs from 'fs';
import * as path from 'path';
import * as jsbeautifier from 'js-beautify';
import * as _ from 'lodash';

const targetDir = process.argv[2];
const filenames = _(process.argv).drop(3).value();

filenames.forEach((filename) => {
    const source = fs.readFileSync(path.normalize(filename), 'utf8');
    const moduleName = path.basename(filename, '.jison');
    const options: ParserOptions  = {type: 'lalr', moduleType: 'commonjs', moduleName: moduleName, moduleMain: function(){}};

    const parser = new Parser(source, options);

    // generate source, ready to be written to disk
    const parserSource = parser.generate(options);

    const outFileName = (targetDir + '/' + path.basename(filename, '.jison') + '.js').replace('//', '/');

    fs.writeFileSync(outFileName, jsbeautifier(parserSource));
});

process.exit();
