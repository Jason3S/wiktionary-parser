
import * as _ from 'lodash';

interface ParamDictionary {
    [index: string]: string;
    [index: number]: string;
}

export const CONTENT = 'content';

export interface Ast {
    t?: string;
    v?: any;
    c?: Ast[];
}

interface Leaf extends Ast {
    v: any;
}

interface Node extends Ast {
    t: string;
    c: Ast[];
}

export function missingParam(): Leaf {
    return { v: undefined };
}

export function leaf(v): Leaf {
    v = v === undefined ? null : v;
    return { v: v };
}

export function node(t: string, c: Ast[] = []): Node {
    return { t: t, c: c };
}

export function addChild(n: Node, c: Ast): Node {
    return append(n, c);
}

export function append(n: Node, b: Ast): Node {
    const c = n.c.concat([b]);
    const { t } = n;
    return { t, c};
}

export function content(a: Ast, b?: Ast): Node {
    if (! b) {
        if (! a) {
            return node(CONTENT);
        }
        if (a.t === CONTENT) {
            return a as Node;
        }
        return node(CONTENT, [a]);
    }
    if (a.t === CONTENT) {
        if (b.t === CONTENT) {
            return node(CONTENT, a.c.concat(b.c));
        }
        return node(CONTENT, a.c.concat([b]));
    } else if (b.t === CONTENT) {
        return node(CONTENT, [a].concat(b.c));
    }

    return node(CONTENT, [a, b]);
}


function trimParamLeft(ast) {
    if (ast == null) {
        return ast;
    }

    if (typeof ast.v === 'string') {
        ast.v = ast.v.trimLeft();

        if (ast.v === '') {
            return null;
        }

        return ast;
    }

    const c = ast.c;
    if (! c || ! c.length) {
        return null;
    }

    if (ast.t !== CONTENT) {
        return ast;
    }

    const len = c.length;
    let i;

    for (i = 0; i < len; ++i) {
        c[i] = trimParamLeft(c[i]);
        if (c[i] !== null) {
            break;
        }
    }

    if (i >= len) {
        return null;
    }

    ast.c = c.slice(i);

    if (ast.c.length === 1) {
        return ast.c[0];
    }

    return ast;
}


function trimParamRight(ast) {
    if (ast == null) {
        return ast;
    }

    if (typeof ast.v === 'string') {
        ast.v = ast.v.trimRight();

        if (ast.v === '') {
            return null;
        }

        return ast;
    }

    const c = ast.c;
    if (! c || ! c.length) {
        return null;
    }

    if (ast.t !== CONTENT) {
        return ast;
    }

    const len = c.length;
    let i;

    for (i = len - 1; i >= 0; --i) {
        c[i] = trimParamRight(c[i]);
        if (c[i] !== null) break;
    }

    if (i < 0) {
        return null;
    }

    ast.c = c.slice(0, i + 1);

    if (ast.c.length === 1) {
        return ast.c[0];
    }

    return ast;
}

export function trimParam(ast) {
    ast = trimParamRight(trimParamLeft(ast));
    if (ast == null) {
        return leaf(null);
    }
    return ast;
}

/**
 * Covert the page params in to a dicitonary of key/value pairs.
 *
 * @param {string[]} pageParams array of strings passed to the template, this strings can have two forms
 *                              just a value or key=value, the ones with out a value will be assigned a numeric key
 *                              in the order in which they are in the list.
 * @returns {ParamDictionary}
 */
export function normalizeParams(pageParams: string[]): ParamDictionary {
    const namedParamRegEx = /^([a-zA-Z0-9]+)[=](.*)$/;

    interface ParamSet { last: number; params: ParamDictionary; }
    const paramSet: ParamSet = _(pageParams)
        .map(p => '' + p)   // force a string
        .reduce((ps: ParamSet, value: string): ParamSet => {
            const match = value.match(namedParamRegEx);
            if (match) {
                const params = _.assign({}, ps.params, { [match[1]]: match[2] }) as ParamDictionary;
                return { last: ps.last, params };
            }
            const params = _.assign({}, ps.params, { [ps.last]: value }) as ParamDictionary;
            return { last: ps.last + 1, params };
        }, { last: 1, params: {} } as ParamSet);

    return paramSet.params;
}

export function normalizePageName(pageName) {
    return pageName.replace(/^[^:]+[:]/, '');
}

export function processWikiTemplate(page, params, ast, transclusion) {
    const INCLUDE_MODE = 'include';

    transclusion = transclusion || INCLUDE_MODE;
    const isIncludeOnly = transclusion === INCLUDE_MODE;
    const isNoInclude = transclusion !== INCLUDE_MODE;
    const pageParams = normalizeParams(params);
    const pageName = normalizePageName(page);

    const functions = {
        pageParam: getPageParam,
        '+':  function(a, b){ return a + b; },
        '-':  function(a, b){ return a - b; },
        '*':  function(a, b){ return a * b; },
        '/':  function(a, b){ return a / b; },
        '||': function(a, b){ return a || b; },
        '&&': function(a, b){ return a && b; },
        'if': function(a, b, c) { return a ? b : c; },
        'ifeq': function(a, b, c, d) { return ((a === b) || (a - b === 0)) ? c : d; },
        pow: Math.pow,
        includeonly: function(content) { return isIncludeOnly ? content : ''; },
        noinclude: function(content) { return isNoInclude ? content : ''; },
        'content': function(...args) { return args.length === 1 ? args[0] : args.join(''); }
    };

    function processAst(ast) {
        const v = ast.v;
        const c = ast.c;
        if (v !== undefined || c === undefined) {
            return v;
        }

        const p = _.map(c, a => processAst(a));
        const fn = functions[ast.t];
        if (fn === undefined) {
            console.log("Unknown function: '" + ast.t + "'");
            return undefined;
        }
        return fn.apply(this, p);
    }


    function getPageParam(name, alternate) {
        name = ('' + name).trim();

        if (alternate === null) {
            alternate = pageName;
        }
        if (alternate === undefined) {
            alternate = '{{{' + name + '}}}';
        }
        const p = pageParams[name];
        if (p === undefined) {
            return alternate;
        }
        return p;
    }

    return processAst(ast);
}

