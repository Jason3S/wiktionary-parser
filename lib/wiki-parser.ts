/**
 * Created by jasondent on 02/01/2016.
 */

var wiktionary = require('../jison/wiktionary');

import { WikiAbstractSyntaxTree } from "./wiki-ast";

export function parse(text:string):WikiAbstractSyntaxTree {
    return wiktionary.parse(text);
}
