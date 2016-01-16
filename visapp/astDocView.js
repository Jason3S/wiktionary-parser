/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var GenericNode = (function (_super) {
    __extends(GenericNode, _super);
    function GenericNode() {
        _super.apply(this, arguments);
    }
    return GenericNode;
})(React.Component);
var AstDocView = (function (_super) {
    __extends(AstDocView, _super);
    function AstDocView(props) {
        _super.call(this, props);
        this.state = { showChildren: false };
    }
    AstDocView.prototype.render = function () {
        return (React.createElement("div", {"className": "docView"}, React.createElement("b", null, React.createElement("i", null, "Doc View"))));
    };
    return AstDocView;
})(React.Component);
exports.AstDocView = AstDocView;
//# sourceMappingURL=astDocView.js.map