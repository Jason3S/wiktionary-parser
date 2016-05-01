
import * as _ from 'lodash';
import {merge} from 'tsmerge';

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

export function flatten<T>(fetch: () => T[]): () => T {
    let buffer: T[] = [];

    return () => {
        if (!buffer || !buffer.length) {
            buffer = fetch();
            if (!buffer) {
                return undefined;
            }
        }
        return buffer.shift();
    };
}

export function flattenTokens<T>(fetch: () => T[] | T): () => T {
    return flatten(() => {
        const tokens = fetch();
        if (Array.isArray(tokens)) {
            return tokens;
        }
        return [tokens as T];
    });
}