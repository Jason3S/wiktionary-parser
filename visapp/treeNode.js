/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var TreeNode = (function (_super) {
    __extends(TreeNode, _super);
    function TreeNode(props) {
        _super.call(this, props);
        var model = props.model;
        this.state = { showChildren: true };
    }
    TreeNode.prototype.render = function () {
        var _this = this;
        var props = this.props;
        var model = props.model || { t: '' };
        var hasChildren = model.c && model.c.length;
        var children = hasChildren && model.c
            ? model.c.map(function (node, index) { return (React.createElement(TreeNode, {"key": index, "model": node, "query": props.query})); })
            : null;
        var nodeValue = model.v || '';
        if (hasChildren) {
            return (React.createElement("div", {"className": "treeNode"}, React.createElement("label", null, React.createElement("input", {"type": "checkbox", "onChange": function () { _this.toggleShowChildren(); }}), " ", model.t), React.createElement("div", {"className": this.state.showChildren ? 'show' : 'hidden'}, children)));
        }
        return (React.createElement("div", {"className": "treeNode"}, React.createElement("b", null, model.t, ": "), React.createElement("i", null, nodeValue.toString().substr(0, 50))));
    };
    TreeNode.prototype.toggleShowChildren = function () {
        this.setState({ showChildren: !this.state.showChildren });
    };
    return TreeNode;
})(React.Component);
exports.TreeNode = TreeNode;
//# sourceMappingURL=treeNode.js.map