/**
 * Created by jasondent on 16/01/2016.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var React = require('react');
var _ = require('lodash');
var jQuery = require('jquery');
var wikiParser = require('../lib/wiki-parser');
var treeNode_1 = require("./treeNode");
var astDocView_1 = require("./astDocView");
var AstViewer = (function (_super) {
    __extends(AstViewer, _super);
    function AstViewer(props) {
        _super.call(this, props);
        this.state = AstViewer.defaultState;
        this.fetchTree(props.lang, props.word);
    }
    AstViewer.prototype.fetchTree = function (lang, word) {
        var _this = this;
        var params = {
            action: 'query',
            prop: 'revisions|info',
            rvprop: 'content',
            format: 'json',
            titles: word
        };
        var uri = 'https://' + lang + '.wiktionary.org/w/api.php?';
        var url = uri + _
            .map(params, function (value, key) { return encodeURIComponent(key) + '=' + encodeURIComponent(value); })
            .join('&');
        var request = {
            url: url,
            dataType: 'jsonp',
            crossDomain: true
        };
        jQuery.ajax(request).then(function (result) {
            var pages = _(result.query.pages)
                .filter(function (p) { return p.title == word && p.pagelanguage == lang; })
                .map(function (p) { return p.revisions; })
                .filter(function (p) { return p; })
                .map(function (p) { return p[0]; })
                .filter(function (p) { return p; })
                .map(function (p) { return p['*']; })
                .filter(function (p) { return p; })
                .value();
            pages = pages || [];
            var markup = pages[0] || '';
            var tree;
            try {
                tree = wikiParser.parse(markup);
            }
            catch (e) {
                tree = { t: 'parse-error', v: e.message };
            }
            _this.setState({ tree: tree });
        });
    };
    AstViewer.prototype.componentWillReceiveProps = function (newProps) {
        var props = this.props;
        var isChanged = props.lang != newProps.lang || props.word != newProps.word;
        if (isChanged) {
            this.setState(AstViewer.defaultState);
            this.fetchTree(newProps.lang, newProps.word);
        }
    };
    AstViewer.prototype.render = function () {
        var _a = this.props, lang = _a.lang, word = _a.word;
        return ((React.createElement("div", null, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-md-12"}, "Language: ", lang, ", Word: ", word)), React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-md-4 ast-tree-view"}, "Wiki AST", React.createElement(treeNode_1.TreeNode, {"model": this.state.tree, "query": this.props})), React.createElement("div", {"className": "col-md-8 ast-doc-view"}, "Document:", React.createElement(astDocView_1.AstDocView, {"model": this.state.tree, "query": this.props}))))));
    };
    AstViewer.defaultState = { tree: { t: 'root' } };
    return AstViewer;
})(React.Component);
exports.AstViewer = AstViewer;
//# sourceMappingURL=astViewer.js.map