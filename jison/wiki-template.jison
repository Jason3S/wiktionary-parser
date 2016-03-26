
/*
    Wiki-Template pre-processor grammar.
    To build this grammar:
    $ jison wiki-template.jison -m commonjs -p lalr
*/

%{
    // First Block of code.
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
        // parser.processWikiTemplate = processWikiTemplate;
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

var _ = require('lodash');

var CONTENT = 'content';

function leaf(v) {
    v = (typeof v === "undefined") ? null : v;
    return { v: v };
}

function missingParam() {
    return { v: undefined };
}

function node(t, c) {
    return { t: t, c: c };
}

function addChild(node, c) {
    node.c.push(c);
    return node;
}

function append(a, b) {
    a.c.concat([b]);
    return a;
}

function content(a, b) {
    if (! b) {
        if (a.t === CONTENT) {
            return a;
        }
        return node(CONTENT, [a]);
    }
    if (a.t === CONTENT) {
        if (b.t === CONTENT) {
            a.c.concat(b.c);
        } else {
            a.c.concat([b]);
        }
        return a;
    } else if (b.t === CONTENT) {
        return node(CONTENT, [a].concat(b.c));
    }

    return node(CONTENT, [a,b]);
}


function trimParamLeft(ast) {
    "use strict";

    var c, len, i;

    if (ast == null) {
        return ast;
    }

    if (typeof ast.v === "string") {
        ast.v = ast.v.trimLeft();

        if (ast.v === '') {
            return null;
        }

        return ast;
    }

    c = ast.c;
    if (! c || ! c.length) {
        return null;
    }

    if (ast.t !== CONTENT) {
        return ast;
    }

    len = c.length;

    for(i = 0; i < len; ++i) {
        c[i] = trimParamLeft(c[i]);
        if (c[i] !== null) break;
    }

    if (i >= len) {
        return null;
    }

    ast.c = c.slice(i);

    if (ast.c.length == 1) {
        return ast.c[0];
    }

    return ast;
}


function trimParamRight(ast) {
    "use strict";

    var c, len, i;

    if (ast == null) {
        return ast;
    }

    if (typeof ast.v === "string") {
        ast.v = ast.v.trimRight();

        if (ast.v === '') {
            return null;
        }

        return ast;
    }

    c = ast.c;
    if (! c || ! c.length) {
        return null;
    }

    if (ast.t !== CONTENT) {
        return ast;
    }

    len = c.length;

    for(i = len-1; i >= 0; --i) {
        c[i] = trimParamRight(c[i]);
        if (c[i] !== null) break;
    }

    if (i < 0) {
        return null;
    }

    ast.c = c.slice(0, i+1);

    if (ast.c.length == 1) {
        return ast.c[0];
    }

    return ast;
}

function trimParam(ast) {
    ast = trimParamRight(trimParamLeft(ast));
    if (ast == null) {
        return leaf(null);
    }
    return ast;
}

function processWikiTemplate(page, params, ast, transclusion) {
    "use strict";

    var INCLUDE_MODE = 'include';

    transclusion = transclusion || INCLUDE_MODE;
    var isIncludeOnly = transclusion === INCLUDE_MODE;
    var isNoInclude = transclusion !== INCLUDE_MODE;
    var pageParams = normalizeParams(params);
    var pageName = normalizePageName(page);

    var functions = {
        pageParam: getPageParam,
        "+":  function(a, b){ return a + b; },
        "-":  function(a, b){ return a - b; },
        "*":  function(a, b){ return a * b; },
        "/":  function(a, b){ return a / b; },
        "||": function(a, b){ return a || b; },
        "&&": function(a, b){ return a && b; },
        "if": function(a, b, c) { return a ? b : c; },
        "ifeq": function(a, b, c, d) { return (a == b) ? c : d; },
        pow: Math.pow,
        includeonly: function(content) { return isIncludeOnly ? content : ''; },
        noinclude: function(content) { return isNoInclude ? content : ''; },
        "content": function() { return arguments.length == 1 ? arguments[0] : Array.from(arguments).join(''); }
    };

    function processAst(ast) {
        var i;
        var v = ast.v;
        var c = ast.c;
        var p = [];
        if (v !== undefined || c === undefined) {
            return v;
        }

        for (i = 0; i < c.length; i += 1) {
            p[i] = processAst(c[i]);
        }
        var fn = functions[ast.t];
        if (fn === undefined) {
            console.log("Unknown function: '"+ast.t+"'");
            return undefined;
        }
        return fn.apply(this, p);
    }

    function normalizeParams(pageParams) {
        var params = [undefined];
        var namedParamRegEx = /^([a-zA-Z0-9]+)[=](.*)$/;
        for (var i in pageParams) {
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

    function normalizePageName(pageName) {
        return pageName.replace(/^[^:]+[:]/, '');
    }

    function getPageParam(name, alternate) {
        name = ('' + name).trim();

        if (alternate === null) {
            alternate = pageName;
        }
        if (alternate === undefined) {
            alternate = '{{{'+name+'}}}';
        }
        var p = pageParams[name];
        if (p === undefined) {
            return alternate;
        }
        return p;
    }

    return processAst(ast);
}

parser.processWikiTemplate = processWikiTemplate;

