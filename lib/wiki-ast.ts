/**
 * Created by jasondent on 01/01/2016.
 */

var _ = require('lodash');

export interface WikiAbstractSyntaxTree {
    t: string;
    c?: WikiAbstractSyntaxTree[];
    v?: string;
}

var sampleTreeNode: WikiAbstractSyntaxTree = {
    t: 'type',
    c: [],
    v: 'value'
};

export function validateWikiAbstractSyntaxTree(ast: WikiAbstractSyntaxTree) {
    var valid = true;
    valid = valid && ast.t !== undefined;
    valid = valid && _.reduce(ast, function(valid: boolean, v:any, k:string): boolean {
            return valid && _.has(sampleTreeNode, k);
        }, valid);
    valid = valid && (!ast.c || _.reduce(ast.c, function(valid: boolean, ast: WikiAbstractSyntaxTree){
            return valid && validateWikiAbstractSyntaxTree(ast);
        }, valid));
    return valid;
}

