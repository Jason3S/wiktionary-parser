
/*
    Wiki-Template pre-processor grammar.
    To build this grammar:
    $ jison wiki-template.jison -m commonjs -p lalr
*/

%{
    // First Block of code.

    var leaf = thunk('leaf');
    var missingParam = thunk('missingParam');
    var node = thunk('node');
    var addChild = thunk('addChild');
    var append = thunk('append');
    var content = thunk('content');
    var trimParam = thunk('trimParam');

    function thunk(name) {
        var fn;
        return function() {
            if (!fn) {
                var jisonHelper = require('./jisonHelper');
                fn = jisonHelper[name];
            }
            return fn.apply(this, arguments);
        };
    }
%}

/* lexical grammar */

%lex

%x param template expr

%%

"{{{"                               %{ this.begin('param'); return 'PARAM_START'; %}
<param>"{{{"                        %{ this.begin('param'); return 'PARAM_START'; %}
<template>"{{{"                     %{ this.begin('param'); return 'PARAM_START'; %}
<param>"}}}"                        %{ this.popState(); return 'PARAM_END'; %}
<param>"|"                          return '|';
<param>.                            return 'TEXT';
"{{"                                %{ this.begin('template'); return '{{'; %}
<template>"{{"                      %{ this.begin('template'); return '{{'; %}
<template>"}}"                      %{ this.popState(); return '}}'; %}
<template>\s*"#if:"                 return '#if:';
<template>\s*"#ifeq:"               return '#ifeq:';
<template>\s*"#expr:"               %{ this.begin('expr'); return '#expr:'; %}
<template>"|"                       return '|';
<template>[0-9]+([.][0-9]+)?        return 'NUMBER';
<template>(.|\n)                    return 'TEXT';
<expr>"{{{"                         %{ this.begin('param'); return 'PARAM_START'; %}
<expr>"{{"                          %{ this.begin('template'); return '{{'; %}
<expr>[0-9]+([.][0-9]+)?            return 'NUMBER';
<expr>"true"                        return "TRUE";
<expr>"false"                       return "FALSE";
<expr>"and"                         return '&&';
<expr>"or"                          return '||';
<expr>"="                           return '=';
<expr>"("                           return '(';
<expr>")"                           return ')';
<expr>"+"                           return '+';
<expr>"-"                           return '-';
<expr>"*"                           return '*';
<expr>"/"                           return '/';
<expr>"^"                           return '^';
<expr>"pi"                          return 'PI';
<expr>"e"                           return 'E';
<expr>"}}"                           %{ this.popState(); return '}}'; %}
<expr>\s+                           /* ignore space in expressions */
"<includeonly>"                     return 'INCLUDE_ONLY';
"</includeonly>"                    return 'INCLUDE_ONLY_END';
"<noinclude>"                       return 'NO_INCLUDE';
"</noinclude>"                      return 'NO_INCLUDE_END';
(.|\n)                              return 'TEXT';


%%

    /* Begin Lexer Customization Methods */
    (function (){
        var _originalLexMethod = lexer.lex;
        var _originalParserMethod = parser.parse;
        var _tokenCache = [];
        var _debug = true;
        var tokenMap = [];

        var _params = {};
        var _pageName = 'Unknown';

        function log() {
            if (_debug) {
                console.log.apply(console, arguments);
            }
        }

        function getTokenText(token) {
            if (Number.isInteger(token)) {
                return tokenMap[token] || ('Token Not Found: ' + token);
            }
            return token;
        }

        lexer.lex = function() {
            var token = _tokenCache.shift();
            if (token) {
                log(getTokenText(token));
                return token;
            }
            token = _originalLexMethod.call(this);
            if (Array.isArray(token)) {
                _tokenCache = token;
                return this.lex();
            }
            log(getTokenText(token));
            return token;
        };


        function setupTokenMap() {
            var symbols = parser.symbols_;
            for (token in symbols) {
                if (symbols.hasOwnProperty(token)) {
                    tokenMap[symbols[token]] = token;
                }
            }
        }

        setupTokenMap();
    }());

    /* End Lexer Customization Methods */

/lex


/* operator associations and precedence */
%left '+' '-'
%left '*' '/'
%left '^'
%right UMINUS


%start start

%% /* language grammar */


start
    : content <<EOF>>
        { return $1; }
    | <<EOF>>
        { return leaf(null); }
    ;

content
    : content-item
        { $$ = content($1); }
    | content content-item
        { $$ = content($1, $2); }
    ;

content-item
    : text
    | page-param
    | function
    | node
    ;

node
    : INCLUDE_ONLY content INCLUDE_ONLY_END
        { $$ = node('includeonly', [$2]); }
    | NO_INCLUDE content NO_INCLUDE_END
        { $$ = node('noinclude', [$2]); }
    ;

page-param
    : PARAM_START PARAM_END
        { $$ = node('pageParam', [missingParam(null)]); }
    | PARAM_START param2 PARAM_END
        { $$ = node('pageParam', $2); }
    ;

param
    : param-wrapper
        { $$ = trimParam($1); }
    ;

param-wrapper
    : param-item
        { $$ = $1 }
    | param-wrapper param-item
        { $$ = content($1, $2); }
    ;

param-item
    : text
    | number
    | function
    | page-param
    ;


function
    : function-ifs
    | function-expr
    | template
    ;

function-ifs
    : '{{' '#if:' param3 '}}'
        { $$ = node('if', $3); }
    | '{{' '#if:' '}}'
        { $$ = node('if', [].fill(missingParam(),0,3)); }
    | '{{' '#ifeq:' param4 '}}'
        { $$ = node('ifeq', $3); }
    | '{{' '#ifeq:' '}}'
        { $$ = node('ifeq', [].fill(missingParam(),0,4)); }
    ;

template
    : '{{' params '}}'
        { $$ = node('template', $2); }
    | '{{' params '}}'
        { $$ = node('template', []); }
    ;

params
    : param1
        { $$ = $1; }
    | params param1
        { $$ = $1.concat($2); }
    ;

param4
    : param2 '|' param2
        { $$ = $1.concat($3); }
    | param3
        { $$ = $1.concat([missingParam()]); }
    ;

param3
    : param2 '|' param1
        { $$ = $1.concat($3); }
    | param2 '|'
        { $$ = $1.concat([leaf()]); }
    | param2
        { $$ = $1.concat([missingParam()]); }
    ;

param2
    : param1 '|' param1
        { $$ = $1.concat($3); }
    | param1 '|'
        { $$ = $1.concat([leaf()]); }
    | '|' param1
        { $$ = [leaf()].concat($2); }
    | '|'
        { $$ = [leaf(),leaf()]; }
    | param1
        { $$ = $1.concat([missingParam()]); }
    ;

param1
    : param
        { $$ = [$1]; }
    ;

function-expr
    : '{{' '#expr:' e '}}'
        { $$ = $e; }
    ;

e
    : e '+' e
        {$$ = node('+', [$1, $3]);}
    | e '-' e
        {$$ = node('-', [$1, $3]);}
    | e '*' e
        {$$ = node('*', [$1, $3]);}
    | e '/' e
        {$$ = node('/', [$1, $3]);}
    | e '||' e
        {$$ = node('||', [$1, $3]);}
    | e '&&' e
        {$$ = node('&&', [$1, $3]);}
    | e '^' e
        {$$ = node('pow', [$1, $3]);}
    | '-' e %prec UMINUS
        {$$ = node('-', [leaf(0), $2]);}
    | '(' e ')'
        {$$ = $2;}
    | number
        {$$ = $1;}
    | TRUE
        {$$ = leaf(true);}
    | FALSE
        {$$ = leaf(false);}
    | E
        {$$ = leaf(Math.E);}
    | PI
        {$$ = leaf(Math.PI);}
    | page-param
        {$$ = $1;}
    ;

number
    : NUMBER
        {$$ = leaf(Number(yytext));}
    ;

text
    : text-string
        { $$ = leaf($1); }
    ;

text-string
    : TEXT
        { $$ = $1; }
    | text-string TEXT
        { $$ = $1 + $2; }
    ;

%%

// More code

