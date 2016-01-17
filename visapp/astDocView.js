/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var _ = require('lodash');
var mapTypeToViewNodes = {};
function registerMap(conFn, relevantTypes) {
    var map = _.forEach(relevantTypes, function (type) { mapTypeToViewNodes[type] = conFn; });
    return true;
}
var BaseNodeView = (function (_super) {
    __extends(BaseNodeView, _super);
    function BaseNodeView() {
        _super.apply(this, arguments);
    }
    BaseNodeView.renderChildren = function (children) {
        if (children.length) {
            return (children.map(function (model, key) { return BaseNodeView.renderChild(key, model); }));
        }
        return (React.createElement("span", null, "{{empty}}"));
    };
    BaseNodeView.prototype.renderModel = function (model, value, children) {
        if (value !== undefined) {
            return (React.createElement("span", null, value));
        }
        return (React.createElement("div", {"className": "docView"}, React.createElement("b", null, React.createElement("i", null, model.t)), React.createElement("div", null, BaseNodeView.renderChildren(children))));
    };
    BaseNodeView.prototype.render = function () {
        var model = this.props.model;
        var value = model.v;
        var children = model.c || [];
        return this.renderModel(model, value, children);
    };
    BaseNodeView.renderChild = function (key, model) {
        if (model) {
            var viewClassConstructor = mapTypeToViewNodes[model.t] || BaseNodeView;
            return React.createElement(viewClassConstructor, { key: key, model: model });
        }
        return (React.createElement("span", null, "{{null}}"));
    };
    return BaseNodeView;
})(React.Component);
var RootNodeView = (function (_super) {
    __extends(RootNodeView, _super);
    function RootNodeView() {
        _super.apply(this, arguments);
    }
    return RootNodeView;
})(BaseNodeView);
var RenderChildren = (function (_super) {
    __extends(RenderChildren, _super);
    function RenderChildren() {
        _super.apply(this, arguments);
    }
    RenderChildren.prototype.renderModel = function (model, value, children) {
        return (React.createElement("div", {"className": 'ast-' + model.t}, BaseNodeView.renderChildren(children)));
    };
    RenderChildren.registered = registerMap(RenderChildren, [
        'article', 'paragraph', 'paragraphs', 'sections', 'line-of-text', 'lines-of-text', 'wiki-page',
        'section1', 'section2', 'section3', 'section4', 'section5'
    ]);
    return RenderChildren;
})(BaseNodeView);
var RenderSectionContent = (function (_super) {
    __extends(RenderSectionContent, _super);
    function RenderSectionContent() {
        _super.apply(this, arguments);
    }
    RenderSectionContent.prototype.renderModel = function (model, value, children) {
        return (React.createElement("div", {"className": 'ast-' + model.t + ' treeNode'}, BaseNodeView.renderChildren(children)));
    };
    RenderSectionContent.registered = registerMap(RenderSectionContent, [
        'section1-content', 'section2-content', 'section3-content', 'section4-content', 'section5-content'
    ]);
    return RenderSectionContent;
})(BaseNodeView);
var RenderOrderedList = (function (_super) {
    __extends(RenderOrderedList, _super);
    function RenderOrderedList() {
        _super.apply(this, arguments);
    }
    RenderOrderedList.prototype.renderModel = function (model, value, children) {
        return (React.createElement("ol", {"className": 'ast-' + model.t}, BaseNodeView.renderChildren(children)));
    };
    RenderOrderedList.registered = registerMap(RenderOrderedList, ['ordered-list']);
    return RenderOrderedList;
})(BaseNodeView);
var RenderUnorderedList = (function (_super) {
    __extends(RenderUnorderedList, _super);
    function RenderUnorderedList() {
        _super.apply(this, arguments);
    }
    RenderUnorderedList.prototype.renderModel = function (model, value, children) {
        return (React.createElement("ul", {"className": 'ast-' + model.t}, BaseNodeView.renderChildren(children)));
    };
    RenderUnorderedList.registered = registerMap(RenderUnorderedList, ['unordered-list']);
    return RenderUnorderedList;
})(BaseNodeView);
var RenderListItem = (function (_super) {
    __extends(RenderListItem, _super);
    function RenderListItem() {
        _super.apply(this, arguments);
    }
    RenderListItem.prototype.renderModel = function (model, value, children) {
        return (React.createElement("li", {"className": 'ast-' + model.t}, BaseNodeView.renderChildren(children)));
    };
    RenderListItem.registered = registerMap(RenderListItem, ['list-item']);
    return RenderListItem;
})(BaseNodeView);
var RenderSpan = (function (_super) {
    __extends(RenderSpan, _super);
    function RenderSpan() {
        _super.apply(this, arguments);
    }
    RenderSpan.prototype.renderModel = function (model, value, children) {
        return (React.createElement("span", {"className": 'ast-' + model.t}, BaseNodeView.renderChildren(children)));
    };
    RenderSpan.registered = registerMap(RenderSpan, ['text', 'template-name', 'template-param']);
    return RenderSpan;
})(BaseNodeView);
var RenderBold = (function (_super) {
    __extends(RenderBold, _super);
    function RenderBold() {
        _super.apply(this, arguments);
    }
    RenderBold.prototype.renderModel = function (model, value, children) {
        return (React.createElement("b", {"className": 'ast-' + model.t}, BaseNodeView.renderChildren(children)));
    };
    RenderBold.registered = registerMap(RenderBold, ['bold-text']);
    return RenderBold;
})(BaseNodeView);
var RenderItalic = (function (_super) {
    __extends(RenderItalic, _super);
    function RenderItalic() {
        _super.apply(this, arguments);
    }
    RenderItalic.prototype.renderModel = function (model, value, children) {
        return (React.createElement("i", {"className": 'ast-' + model.t}, BaseNodeView.renderChildren(children)));
    };
    RenderItalic.registered = registerMap(RenderItalic, ['italic-text']);
    return RenderItalic;
})(BaseNodeView);
var RenderTemplateParam = (function (_super) {
    __extends(RenderTemplateParam, _super);
    function RenderTemplateParam() {
        _super.apply(this, arguments);
    }
    RenderTemplateParam.prototype.renderModel = function (model, value, children) {
        return (React.createElement("span", {"className": 'ast-' + model.t}, "|", BaseNodeView.renderChildren(children)));
    };
    RenderTemplateParam.registered = registerMap(RenderTemplateParam, ['template-param']);
    return RenderTemplateParam;
})(BaseNodeView);
var RenderSectionTitle = (function (_super) {
    __extends(RenderSectionTitle, _super);
    function RenderSectionTitle() {
        _super.apply(this, arguments);
    }
    RenderSectionTitle.prototype.renderModel = function (model, value, children) {
        var type = model.t;
        var elem = 'h' + type.replace(/^.*?([0-5]).*$/, '$1');
        return React.createElement(elem, null, BaseNodeView.renderChildren(children));
    };
    RenderSectionTitle.registered = registerMap(RenderSectionTitle, [
        'section1-title', 'section2-title', 'section3-title', 'section4-title', 'section5-title'
    ]);
    return RenderSectionTitle;
})(BaseNodeView);
var RenderTemplate = (function (_super) {
    __extends(RenderTemplate, _super);
    function RenderTemplate() {
        _super.apply(this, arguments);
    }
    RenderTemplate.prototype.renderModel = function (model, value, children) {
        return (React.createElement("span", {"className": 'ast-' + model.t}, "{{", BaseNodeView.renderChildren(children), "}}"));
    };
    RenderTemplate.registered = registerMap(RenderTemplate, ['template']);
    return RenderTemplate;
})(BaseNodeView);
var RenderLink = (function (_super) {
    __extends(RenderLink, _super);
    function RenderLink() {
        _super.apply(this, arguments);
    }
    RenderLink.prototype.renderModel = function (model, value, children) {
        var spacer = { t: 'plain-text', v: '|' };
        var spacers = _.fill(new Array(children.length), spacer);
        var c = _.flatten(_.zip(children, spacers)).slice(0, -1);
        return (React.createElement("span", {"className": 'ast-' + model.t}, "[", BaseNodeView.renderChildren(c), "]"));
    };
    RenderLink.registered = registerMap(RenderLink, ['link']);
    return RenderLink;
})(BaseNodeView);
var AstDocView = (function (_super) {
    __extends(AstDocView, _super);
    function AstDocView() {
        _super.apply(this, arguments);
    }
    AstDocView.prototype.render = function () {
        return (React.createElement("div", {"className": "docView"}, React.createElement("b", null, React.createElement("i", null, "Doc View")), React.createElement(RootNodeView, {"model": this.props.model})));
    };
    return AstDocView;
})(React.Component);
exports.AstDocView = AstDocView;
//# sourceMappingURL=astDocView.js.map