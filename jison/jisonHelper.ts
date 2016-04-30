
import * as _ from 'lodash';
import {merge} from 'tsmerge';

export interface ParamDictionary {
    [index: string]: string;
    [index: number]: string;
}

export const CONTENT: 'content' = 'content';

export interface Ast {
    t?: string;
    v?: any;
    c?: Ast[];
}

export interface Leaf extends Ast {
    v: any;
}

export interface Node extends Ast {
    t: string;
    c: Ast[];
}

export interface ContentNode extends Node {
}

export function isContentNode(node: Ast): node is ContentNode {
    return node.t === CONTENT;
}

export function missingParam(): Leaf {
    return { v: undefined };
}

export function leaf(v: any = null): Leaf {
    return { v };
}

export function node(t: string, c: Ast[] = []): Node {
    return { t, c };
}

export function addChild(n: Node, c: Ast): Node {
    return append(n, c);
}

export function append(n: Node, b: Ast): Node {
    const c = n.c.concat([b]);
    const { t } = n;
    return { t, c };
}

export function content(a: Ast, b?: Ast): Node {
    if (! b) {
        if (! a) {
            return node(CONTENT);
        }
        if (isContentNode(a)) {
            return a;
        }
        return node(CONTENT, [a]);
    }
    if (isContentNode(a)) {
        if (isContentNode(b)) {
            return node(CONTENT, a.c.concat(b.c));
        }
        return node(CONTENT, a.c.concat([b]));
    } else if (isContentNode(b)) {
        return node(CONTENT, [a].concat(b.c));
    }
    return node(CONTENT, [a, b]);
}


function baseTrim(ast: Ast, direction: 'left' | 'right') {
    const { fnTrim, fnReduce } = direction === 'left'
        ? {
            fnTrim: _.trimLeft,
            fnReduce: (c: Ast[]): Ast[] => c.reduce((accum: Ast[], ast: Ast): Ast[] => {
                if (accum) {
                    return [...accum, ast];
                }
                const c = baseTrim(ast, direction);
                if (c) {
                    return [c];
                }
                return null;
            }, null)
        }
        : {
            fnTrim: _.trimRight,
            fnReduce: (c: Ast[]): Ast[] => c.reduceRight((accum: Ast[], ast: Ast): Ast[] => {
                if (accum) {
                    return [ast, ...accum];
                }
                const c = baseTrim(ast, direction);
                if (c) {
                    return [c];
                }
                return null;
            }, null)
        }
        ;

    if (!ast) {
        return null;
    }
    if (typeof ast.v === 'string') {
        const v = fnTrim(ast.v);
        if (v === '') {
            return null;
        }
        return merge(ast, {v});
    }
    if (!ast.c || !ast.c.length) {
        return null;
    }

    if (!isContentNode(ast)) {
        return ast;
    }

    const c = fnReduce(ast.c);
    if (!c) {
        return null;
    }

    if (c.length === 1 && isContentNode(c[0])) {
        return c[0];
    }

    return merge(ast, { c });
}

function trimParamLeft(ast) {
    return baseTrim(ast, 'left');
}


function trimParamRight(ast) {
    return baseTrim(ast, 'right');
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

