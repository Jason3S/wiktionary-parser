
/*
    Wiki-Template pre-processor grammar.
    To build this grammar:
    $ jison wiki-template.jison -m commonjs -p lalr
*/

/* lexical grammar */

%lex

%x param template expr

%%

"{{{"                               %{ this.begin('param'); return 'PARAM_START'; %}
<param>"{{{"                        %{ this.begin('param'); return 'PARAM_START'; %}
<template>"{{{"                     %{ this.begin('param'); return 'PARAM_START'; %}
<param>"}}}"                        %{ this.popState(); return 'PARAM_END'; %}
<param>"|"                          return 'PARAM_SEPARATOR';
<param>.                            return 'TEXT';
"{{"                                %{ this.begin('template'); return '{{'; %}
<template>"{{"                      %{ this.begin('template'); return '{{'; %}
<template>"}}"                      %{ this.popState(); return '}}'; %}
<template>\s*"#if:"                 return '#if:';
<template>\s*"#expr:"               %{ this.begin('expr'); return '#expr:'; %}
<template>"|"                       return '|';
<template>.                         return 'TEXT';
<expr>"{{"                          %{ this.begin('template'); return '{{'; %}
<expr>[0-9]+([.][0-9]+)?            return 'NUMBER';
<expr>"and"                         return '&&';
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
.                                   return 'TEXT';


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

        function normalizeParams(pageName, pageParams) {
            var params = [undefined];
            var namedParamRegEx = /^([a-zA-Z0-9]+)[=](.*)$/;
            for (i in pageParams) {
                if (pageParams.hasOwnProperty(i)) {
                    var p = '' + pageParams[i];
                    var m = p.match(namedParamRegEx);
                    if (m) {
                        params[m[1]] = m[2];
                    } else {
                        params.push(p);
                    }
                }
            }

            return params;
        }

        parser.parse = function(input, pageName, params) {
            _pageName = pageName;
            _params = normalizeParams(pageName, params);
            return _originalParserMethod.call(this, input);
        };

        function processParam(name, alternate) {

            name = ('' + name).trim();

            if (alternate === null) {
                alternate = _pageName;
            }
            if (alternate === undefined) {
                alternate = '';
            }
            var p = _params[name];
            if (p === undefined) {
                return alternate;
            }
            return p;
        }

        parser.processParam = processParam;

        function setupTokenMap() {
            var symbols = parser.symbols_;
            for (token in symbols) {
                if (symbols.hasOwnProperty(token)) {
                    tokenMap[symbols[token]] = token;
                }
            }
        }

        setupTokenMap();

        return {
            processParam: processParam
        };
    }());

    /* End Lexer Customization Methods */

/lex


/* operator associations and precedence */
%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS


%start start

%% /* language grammar */


start
    : content <<EOF>>
        { return $1; }
    | <<EOF>>
        { return ''; }
    ;

content
    : content-item
        { $$ = $1; }
    | content content-item
        { $$ = $1 + $2; }
    ;

content-item
    : text
    | page-param
    | function
    ;

page-param
    : PARAM_START PARAM_END
        { $$ = processParam(null); }
    | PARAM_START PARAM_SEPARATOR PARAM_END
        { $$ = processParam(null, null); }
    | PARAM_START text PARAM_END
        { $$ = processParam($2); }
    | PARAM_START text PARAM_SEPARATOR PARAM_END
        { $$ = processParam($2, null); }
    | PARAM_START text PARAM_SEPARATOR text PARAM_END
        { $$ = processParam($2, $4); }
    ;

param
    : param-item
        { $$ = $1 }
    | param param-item
        { $$ = $1 + $2; }
    ;

param-item
    : text
    | function
    | page-param
    ;


function
    : function-if
    | function-expr
    ;

function-if
    : '{{' '#if:' param '|' param '|' param '}}'
        { $$ = $param1.trim() ? $param2.trim() : $param3.trim(); }
    | '{{' '#if:' param '|' param '|' '}}'
        { $$ = $param1.trim() ? $param2.trim() : ''; }
    | '{{' '#if:' param '|' '|' param '}}'
        { $$ = $param1.trim() ? '' : $param2.trim(); }
    | '{{' '#if:' param '|' '|' '}}'
        { $$ = ''; }
    | '{{' '#if:' param '|' '}}'
        { $$ = ''; }
    | '{{' '#if:' param '}}'
        { $$ = ''; }
    ;

function-expr
    : '{{' '#expr:' e '}}'
        { $$ = $e; }
    ;

e
    : e '+' e
        {$$ = $1+$3;}
    | e '-' e
        {$$ = $1-$3;}
    | e '*' e
        {$$ = $1*$3;}
    | e '/' e
        {$$ = $1/$3;}
    | e '^' e
        {$$ = Math.pow($1, $3);}
    | '-' e %prec UMINUS
        {$$ = -$2;}
    | '(' e ')'
        {$$ = $2;}
    | NUMBER
        {$$ = Number(yytext);}
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    ;


text
    : TEXT
        { $$ = $1; }
    | text TEXT
        { $$ = $1 + $2; }
    ;

%%

function processParam (param, alternate) {
    return parser.processParam(param, alternate);
}
