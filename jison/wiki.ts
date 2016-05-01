export * from './jisonHelper';
export * from './wikiAstAnalyzer';

import * as wikiTemplate from './wiki-template';
import * as wiktionary from './wiktionary';
import * as wiki from './wiki-parser';

export const wikiTemplateParser = {
    parse: wikiTemplate.parse,
    Parser: wikiTemplate.Parser,
};

export const wiktionaryParser = {
    parse: wiktionary.parse,
    Parser: wiktionary.Parser,
};

export const wikiParser = {
    parse: wiki.parse,
    Parser: wiki.Parser,
};