/**
 * Created by jasondent on 09/01/2016.
 */

import * as _ from 'lodash';

export interface PageInfo {
    page: string;
    params: string[];
    isTranscluded: boolean;
}

export interface WikiAst {
    type?: string;
    children?: WikiAst[];
    value?: any;
}

export interface WikiAstTree extends WikiAst {
    eval(info: PageInfo): any;
    getType(): any;
}

export interface WikiAstNode extends WikiAstTree {
    children: WikiAst[];
}

export interface IWikiAstLeaf extends WikiAstTree {
    value: any;
}

class AstEvalContext {
    constructor(public node: WikiAstTree, public info: PageInfo) {}
    public static eval(
        node: WikiAstTree,
        info: PageInfo,
        fn: (...values) => any,
        values
    ) {
        return fn.apply(new AstEvalContext(node, info), values);
    }
}

export class GenericNode implements WikiAstTree, WikiAstNode {
    constructor(public children: WikiAstTree[], public type: string, public fn: (...values) => any, public limit: number = 0) {}
    public eval(info: PageInfo): any {
        const seq = _(this.children).map(c => c.eval(info));
        return AstEvalContext.eval(this, info, this.fn, seq.value());
    }
    public getType() {
        return this.type;
    }
}

export class GenericLeaf implements WikiAstTree, IWikiAstLeaf {
    constructor(public type: string, public value: any, public fn = (value: any) => { return value; }) {}
    public eval(info: PageInfo): any {
        return this.fn(this.value);
    }
    public getType() {
        return this.type;
    }
}

export class TransclusionNode implements WikiAstTree, WikiAstNode {
    constructor(public children: WikiAstTree[], public type: string) {}

    public eval(info: PageInfo): any {
        const isTranscluded = info.isTranscluded;
        const isIncluded = (isTranscluded && this.type === 'includeonly')
            || (! isTranscluded && this.type === 'noinclude')
            || (this.type === 'onlyinclude');

        if (!isIncluded) {
            return '';
        }
        const seq = _(this.children).map(c => c.eval(info)).value();
        if (seq.length === 1) {
            return seq[0];
        }
        return seq.join('');
    }

    public getType() {
        return this.type;
    }
}

class PageParamContext extends AstEvalContext {

    constructor(public node: WikiAstTree, public info: PageInfo) {
        super(node, info);
    }

    public static normalizePageParam(pageParams) {
        const params = [undefined];
        const namedParamRegEx = /^([a-zA-Z0-9]+)[=](.*)$/;
        for (let i in pageParams) {
            if (pageParams.hasOwnProperty(i)) {
                const p = '' + pageParams[i];
                const m = p.match(namedParamRegEx);
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
        const pageName = this.info.page;
        const pageParams = PageParamContext.normalizePageParam(this.info.params);

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
}

export const fnMap = {
    '+':  {fn: (a, b) => Number(a) + Number(b), limit: 2},
    '-':  {fn: (a, b) => Number(a) - Number(b), limit: 2},
    '*':  {fn: (a, b) => Number(a) * Number(b), limit: 2},
    '/':  {fn: (a, b) => Number(a) / Number(b), limit: 2},
    'pow':    {fn: Math.pow,   limit: 2},
    'ceil':   {fn: Math.ceil,  limit: 1},
    'floor':  {fn: Math.floor, limit: 1},
    '||':  {fn: (a, b) => a || b, limit: 2},
    '&&':  {fn: (a, b) => a && b, limit: 2},
    'if':  {fn: (a, b, c) => a ? b : c, limit: 3},
    'ifeq':  {fn: (a, b, c, d) => ((a === b) || (a - b === 0)) ? c : d},  // test for both exact equal and numeric equal
    content: {fn: (...children) => children.length === 1 ? children[0] : children.join('')},
    pageParam: {fn: PageParamContext.prototype.getPageParam, limit: 2 }
};

function makeNodeMap(type: string) {
    const fnMapItem = fnMap[type];
    return (c: WikiAstTree[]) => new GenericNode(c, type, fnMapItem.fn, fnMapItem.limit);
}

const nodeMap = {
    '+':  makeNodeMap('+'),
    '-':  makeNodeMap('-'),
    '*':  makeNodeMap('*'),
    '/':  makeNodeMap('/'),
    'pow':    makeNodeMap('pow'),
    'ceil':   makeNodeMap('ceil'),
    'floor':  makeNodeMap('floor'),
    '||':   makeNodeMap('||'),
    '&&':   makeNodeMap('&&'),
    'if':   makeNodeMap('if'),
    'ifeq': makeNodeMap('ifeq'),
    includeonly:    (c: WikiAstTree[]) => new TransclusionNode(c, 'includeonly'),
    noinclude:      (c: WikiAstTree[]) => new TransclusionNode(c, 'noinclude'),
    onlyinclude:    (c: WikiAstTree[]) => new TransclusionNode(c, 'onlyinclude'),
    content:        makeNodeMap('content'),
    pageParam:      makeNodeMap('pageParam')
};

export function node(type: string, children: WikiAstTree[]) {
    const fn = nodeMap[type];
    if (! fn) {
        return null;
        // throw new Error('Unknown Type: ' + type);
    }
    return fn(children);
}

export function leaf(value: any, type = 'leaf') {
    return new GenericLeaf(type, value);
}

export interface ISimpleAst {
    t?: string;         // type
    v?: any;            // value
    c?: ISimpleAst[];   // children
}

export function convertAst(bAst: ISimpleAst): WikiAstTree {
    if (bAst.v !== undefined || bAst.c === undefined) {
        return bAst.t ? leaf(bAst.v, bAst.t) : leaf(bAst.v);
    }
    const c = _(bAst.c || []).map(convertAst).value();
    return node(bAst.t, c);
}

