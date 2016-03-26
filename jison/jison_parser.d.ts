interface AssociativeList {
        [name: string]: number;
    }

interface Parser {
    yy: any;
    trace: () => void;
    symbols_: AssociativeList;
    terminals_: AssociativeList;
    productions_: [any];
    performAction: (yytext, yyleng, yylineno, yy, yystate, $$, _$) => void;
    table: [any];
    defaultActions: any;
    parseError: (str, hash) => void;
    parse: (input: string) => any;
    lexer: Lexer;
}

interface ParserConstructor {
    new (): Parser;
}

interface DefaultParserInstance extends Parser {
    Parser: ParserConstructor;
}

interface Lexer {
    EOF: number;
    parseError: (str: string, hash: ErrorHash) => void;
    setInput: (input) => void;
    input: () => any;
    unput: (str: string) => void;
    more: () => any;
    less: (n) => any;
    pastInput: () => any;
    upcomingInput: () => any;
    showPosition: () => any;
    test_match: (regex_match_array, rule_index) => any;
    next: () => any;
    lex: () => any;
    begin: (condition) => any;
    popState: () => any;
    _currentRules: () => any;
    topState: () => any;
    pushState: () => any;

    options: Options;

    performAction: (yy, yy_, $avoiding_name_collisions, YY_START) => any;
    rules: [any];
    conditions: {[name: string]: any};
}


interface Options {
        ranges?: boolean;           // (optional: true ==> token location info will include a .range[] member)
        flex?: boolean;             // (optional: true ==> flex-like lexing behaviour where the rules are
                                    //                     tested exhaustively to find the longest match)
        backtrack_lexer?: boolean;  // (optional: true ==> lexer regexes are tested in order and for each matching
                                    //                     regex the action code is invoked; the lexer terminates
                                    //                     the scan when a token is returned by the action code)
}


interface TokenLocation {
    first_line: number;
    last_line: number;
    first_column: number;
    last_column: number;
    range: [number];        // [start_number, end_number] (where the numbers are indexes into the input string, regular zero-based)
}

//   the parseError function receives a 'hash' object with these members for lexer and parser errors:
interface ErrorHash {
    text: string;           //        (matched text)
    token: string|number;   //        (the produced terminal token, if any)
    line: number;           //        (yylineno)
}

//   while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes:
interface ParseError extends ErrorHash {
    loc: any;               //        (yylloc)
    expected: string;       //    (string describing the set of expected tokens)
    recoverable: boolean;   // (boolean: TRUE when the parser has a error recovery rule available for this particular error)
}
