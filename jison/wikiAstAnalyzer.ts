import * as _ from 'lodash';
import {merge} from 'tsmerge';

export const INCLUDE_MODE: 'include' = 'include';

export interface ParamDictionary {
    [index: string]: string;
    [index: number]: string;
}

export function processWikiTemplate(page, params, ast, transclusion = INCLUDE_MODE) {
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

const namedParamRegEx = /^([a-zA-Z0-9]+)[=](.*)$/;

/**
 * Covert the page params in to a dicitonary of key/value pairs.
 *
 * @param {string[]} pageParams array of strings passed to the template, this strings can have two forms
 *                              just a value or key=value, the ones with out a value will be assigned a numeric key
 *                              in the order in which they are in the list.
 * @returns {ParamDictionary}
 */
export function normalizeParams(pageParams: string[]): ParamDictionary {
    interface ParamSet { last: number; params: ParamDictionary; }
    const paramSet: ParamSet = _(pageParams)
        .map(p => '' + p)   // force a string
        .reduce((ps: ParamSet, value: string): ParamSet => {
            const match = value.match(namedParamRegEx);
            if (match) {
                const params: ParamDictionary = merge(ps.params, { [match[1]]: match[2] });
                return { last: ps.last, params };
            }
            const params: ParamDictionary = merge(ps.params, { [ps.last]: value });
            return { last: ps.last + 1, params };
        }, { last: 1, params: {} } as ParamSet);

    return paramSet.params;
}

export function normalizePageName(pageName) {
    return pageName.replace(/^[^:]+[:]/, '');
}
