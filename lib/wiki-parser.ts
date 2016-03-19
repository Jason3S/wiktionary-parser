/**
 * Created by jasondent on 02/01/2016.
 */

import * as wiktionary from '../jison/wiktionary';
import { WikiAbstractSyntaxTree } from './wiki-ast';

export function parse(text: string): WikiAbstractSyntaxTree {
    let parser = new wiktionary.Parser();
    return parser.parse(text);
}
