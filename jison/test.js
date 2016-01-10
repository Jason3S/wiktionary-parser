/**
 * Created by jasondent on 08/01/2016.
 */


function processWikiTemplate(page, params, ast) {
    "use strict";

    var pageParams = normalizeParams(params);
    var pageName = normalizePageName(page);

    var functions = {
        param: getParam,
        "+": function(a, b){ return a + b;},
        "-": function(a, b){ return a - b;}
    };

    function processAst(ast) {
        var i;
        var v = ast.v;
        var c = ast.c;
        var p = [];
        if (v !== undefined) {
            return v;
        }

        for (i = 0; i < c.length; i += 1) {
            p[i] = processAst(c[i]);
        }
        var fn = functions[ast.type];
        return fn.apply(this, p);
    }

    function normalizeParams(pageParams) {
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

    function normalizePageName(pageName) {
        return pageName.replace(/^[^:]+[:]/, '');
    }

    function getParam(name, alternate) {
        name = ('' + name).trim();

        if (alternate === null) {
            alternate = pageName;
        }
        if (alternate === undefined) {
            alternate = '';
        }
        var p = pageParams[name];
        if (p === undefined) {
            return alternate;
        }
        return p;
    }

    return processAst(ast);
}