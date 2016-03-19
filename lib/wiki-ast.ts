/**
 * Created by jasondent on 01/01/2016.
 */

import * as _ from 'lodash';

export interface WikiAbstractSyntaxTree {
    t: string;
    c?: WikiAbstractSyntaxTree[];
    v?: string;
}

const sampleTreeNode: WikiAbstractSyntaxTree = {
    t: 'type',
    c: [],
    v: 'value'
};

export function validateWikiAbstractSyntaxTree(ast: WikiAbstractSyntaxTree) {
    return ast.t !== undefined
        && _.reduce(ast, function(valid: boolean, v: any, k: string): boolean {
            return valid && _.has(sampleTreeNode, k);
        }, true)
        && (!ast.c || _.reduce(ast.c, function(valid: boolean, ast: WikiAbstractSyntaxTree){
            return valid && validateWikiAbstractSyntaxTree(ast);
        }, true));
}

