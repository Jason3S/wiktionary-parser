/// <reference path="./jison_parser.d.ts" />

export interface WikiAbstractSyntaxTree {
    t: string;
    c?: WikiAbstractSyntaxTree[];
    v?: string;
}

export interface WikiTemplateParser extends DefaultParserInstance {
    parse: (input: string) => WikiAbstractSyntaxTree;
}

declare var parser: WikiTemplateParser;
declare var Parser: {
    new (): WikiTemplateParser;
};
declare var parse: (...args) => WikiAbstractSyntaxTree;

export { parser, Parser, parse };
