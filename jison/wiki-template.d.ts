/// <reference path="./jison_parser.d.ts" />

interface WikiAbstractSyntaxTree {
    t: string;
    c?: WikiAbstractSyntaxTree[];
    v?: string;
}

interface WikiTemplateParser extends DefaultParserInstance {
    processWikiTemplate: (page: string, params: string[], ast: WikiAbstractSyntaxTree, transclusion?: string) => any;
    parse: (input: string) => WikiAbstractSyntaxTree;
}

declare var parser: WikiTemplateParser;
declare var Parser: {
    new (): WikiTemplateParser;
};
declare var parse: (...args) => WikiAbstractSyntaxTree;

export { parser, Parser, parse };
