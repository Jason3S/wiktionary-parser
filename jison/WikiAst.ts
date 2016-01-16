/**
 * Created by jasondent on 09/01/2016.
 */

var _ = require('lodash');

export module WikiAst {

    export interface IPageInfo {
        page: string;
        params: string[];
        isTranscluded: boolean;
    }

    export interface IWikiAst {
        type: string;
        children?: IWikiAst[];
        value?: any;
    }

    export interface IWikiAstTree extends IWikiAst {
        eval(info: IPageInfo):any;
        getType():any;
    }

    export interface IWikiAstNode extends IWikiAstTree {
        children: IWikiAst[];
    }

    export interface IWikiAstLeaf extends IWikiAstTree {
        value: any;
    }

    class AstEvalContext {
        constructor(public node: IWikiAstTree, public info: IPageInfo) {}
        public static eval(
            node: IWikiAstTree,
            info: IPageInfo,
            fn: (...values)=>any,
            values
        ) {
            return fn.apply(new AstEvalContext(node, info), values);
        }
    }

    export class GenericNode implements IWikiAstTree, IWikiAstNode {
        constructor(public children: IWikiAstTree[], public type: string, public fn: (...values)=>any, public limit: number = 0) {}
        public eval(info: IPageInfo):any {
            var seq = _(this.children).map((c)=>{ return c.eval(info); });
            return AstEvalContext.eval(this, info, this.fn, seq.value());
        }
        public getType() {
            return this.type;
        }
    }

    export class GenericLeaf implements IWikiAstTree, IWikiAstLeaf {
        constructor(public type: string, public value: any, public fn = (value:any) => { return value; }) {}
        public eval(info: IPageInfo):any {
            return this.fn(this.value);
        }
        public getType() {
            return this.type;
        }
    }

    export class TransclusionNode implements IWikiAstTree, IWikiAstNode {
        constructor(public children: IWikiAstTree[], public type: string) {}

        public eval(info: IPageInfo):any {
            var isTranscluded = info.isTranscluded;
            var isIncluded = (isTranscluded && this.type == 'includeonly')
                || (! isTranscluded && this.type == 'noinclude')
                || (this.type == 'onlyinclude');

            if (!isIncluded) {
                return '';
            }
            var seq = _(this.children).map((c)=>{ return c.eval(info); }).value();
            if (seq.length == 1) {
                return seq[0];
            }
            return seq.join('');
        }

        public getType() {
            return this.type;
        }
    }

    class PageParamContext extends AstEvalContext {

        constructor(public node: IWikiAstTree, public info: IPageInfo){
            super(node, info);
        }

        public static normalizePageParam(pageParams) {
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

        public getPageParam(name, alternate) {
            name = ('' + name).trim();
            var pageName = this.info.page;
            var pageParams = PageParamContext.normalizePageParam(this.info.params);

            if (alternate === null) {
                alternate = pageName;
            }
            if (alternate === undefined) {
                alternate = '{{{' + name + '}}}';
            }
            var p = pageParams[name];
            if (p === undefined) {
                return alternate;
            }
            return p;
        }
    }

    export var fnMap = {
        "+":  {fn: (a,b)=>{ return Number(a) + Number(b);}, limit: 2},
        "-":  {fn: (a,b)=>{ return Number(a) - Number(b);}, limit: 2},
        "*":  {fn: (a,b)=>{ return Number(a) * Number(b);}, limit: 2},
        "/":  {fn: (a,b)=>{ return Number(a) / Number(b);}, limit: 2},
        "pow":    {fn: Math.pow,   limit:2},
        "ceil":   {fn: Math.ceil,  limit:1},
        "floor":  {fn: Math.floor, limit:1},
        "||":  {fn: (a,b)=>{ return a || b;}, limit:2},
        "&&":  {fn: (a,b)=>{ return a && b;}, limit:2},
        "if":  {fn: (a,b,c)=>{ return a ? b : c;}, limit:3},
        "ifeq":  {fn: (a,b,c,d)=>{ return ((a == b) || (a - b == 0)) ? c : d;}},  // test for both exact equal and numeric equal
        content: {fn: (...children) => { return children.length == 1 ? children[0] : children.join(''); }},
        pageParam: {fn: PageParamContext.prototype.getPageParam, limit:2 }
    };

    function makeNodeMap(type:string) {
        var fnMapItem = fnMap[type];
        return (c: IWikiAstTree[]) => {return new GenericNode(c, type, fnMapItem.fn, fnMapItem.limit);};
    }

    var nodeMap = {
        "+":  makeNodeMap("+"),
        "-":  makeNodeMap("-"),
        "*":  makeNodeMap("*"),
        "/":  makeNodeMap("/"),
        "pow":    makeNodeMap("pow"),
        "ceil":   makeNodeMap("ceil"),
        "floor":  makeNodeMap("floor"),
        "||":   makeNodeMap("||"),
        "&&":   makeNodeMap("&&"),
        "if":   makeNodeMap("if"),
        "ifeq": makeNodeMap("ifeq"),
        includeonly:    (c: IWikiAstTree[]) => {return new TransclusionNode(c, 'includeonly');},
        noinclude:      (c: IWikiAstTree[]) => {return new TransclusionNode(c, 'noinclude');},
        onlyinclude:    (c: IWikiAstTree[]) => {return new TransclusionNode(c, 'onlyinclude');},
        content:        makeNodeMap("content"),
        pageParam:      makeNodeMap("pageParam")
    };

    export function node(type: string, children: IWikiAstTree[]) {
        var fn = nodeMap[type];
        if (! fn) {
            throw new Error('Unknown Type: ' + type);
        }
        return fn(children);
    }

    export function leaf(value : any, type = 'leaf') {
        return new GenericLeaf(type, value);
    }

    export interface ISimpleAst {
        t?: string;         // type
        v?: any;            // value
        c?: ISimpleAst[];   // children
    }

    export function convertAst(bAst: ISimpleAst) : IWikiAstTree {
        if (bAst.v !== undefined || bAst.c === undefined) {
            return bAst.t ? leaf(bAst.v, bAst.t) : leaf(bAst.v);
        }
        var c = _(bAst.c || []).map(convertAst).value();
        return node(bAst.t, c);
    }
}

