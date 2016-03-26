declare module 'jison' {

    export interface ParserOptions {
        type?: "lalr";
        moduleType?: "commonjs";
        moduleName?: string;
        moduleMain?: Function;
    }

    export class Parser {
        constructor(grammar: string, options?: ParserOptions);
        generate(options?: ParserOptions): string;
    }
}