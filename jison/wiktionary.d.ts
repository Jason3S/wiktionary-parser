/// <reference path="./jison_parser.d.ts" />

interface WikiAbstractSyntaxTree {
    t?: string;
    c?: WikiAbstractSyntaxTree[];
    v?: string;
}

interface WiktionaryParser extends Parser {
    parse: (input: string) => WikiAbstractSyntaxTree;
}

interface WiktionaryParserConstructor {
    new (): WiktionaryParser;
}

declare var parser: DefaultParserInstance;
declare var Parser: WiktionaryParserConstructor;
declare var parse: (...args) => WikiAbstractSyntaxTree;

export { parser, Parser, parse, WikiAbstractSyntaxTree };
