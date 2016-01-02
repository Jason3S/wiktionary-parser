/**
 * Created by jasondent on 01/01/2016.
 */
var _ = require('lodash');
var sampleTreeNode = {
    t: 'type',
    c: [],
    v: 'value'
};
function validateWikiAbstractSyntaxTree(ast) {
    var valid = true;
    valid = valid && ast.t !== undefined;
    valid = valid && _.reduce(ast, function (valid, v, k) {
        return valid && _.has(sampleTreeNode, k);
    }, valid);
    valid = valid && (!ast.c || _.reduce(ast.c, function (valid, ast) {
        return valid && validateWikiAbstractSyntaxTree(ast);
    }, valid));
    return valid;
}
exports.validateWikiAbstractSyntaxTree = validateWikiAbstractSyntaxTree;
//# sourceMappingURL=wiki-ast.js.map