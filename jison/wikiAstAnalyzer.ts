import * as _ from 'lodash';
import {normalizeParams, normalizePageName} from './wikiParams';

export const INCLUDE_MODE: 'include' = 'include';

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
        return fn(...p);
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

