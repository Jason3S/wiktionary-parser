/// <reference path="./jison_parser.d.ts" />

interface WikiAbstractSyntaxTree {
    t?: string;
    c?: WikiAbstractSyntaxTree[];
    v?: string;
}


declare var parser: DefaultParserInstance;
declare var Parser: ParserConstructor;
declare var parse: (...args) => WikiAbstractSyntaxTree;

export { parser, Parser, parse };
