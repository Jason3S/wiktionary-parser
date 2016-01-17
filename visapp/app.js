/**
 * Created by jasondent on 16/01/2016.
 */
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var jQuery = require('jquery');
var wikiParser = require('../lib/wiki-parser');
var treeNode_1 = require("./treeNode");
var astDocView_1 = require("./astDocView");
var tree = { t: 'root' };
function render() {
    ReactDOM.render(React.createElement("div", null, "Wiki AST ", React.createElement(treeNode_1.TreeNode, {"model": tree})), document.getElementsByClassName('ast-tree-view')[0]);
    ReactDOM.render(React.createElement("div", null, "Document: ", React.createElement(astDocView_1.AstDocView, {"model": tree})), document.getElementsByClassName('ast-doc-view')[0]);
}
function fetchTree(lang, word) {
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
    jQuery.ajax({
        url: url,
        dataType: 'jsonp',
        crossDomain: true
    }).then(function (result) {
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
        tree = wikiParser.parse(markup);
        render();
    });
}
render();
fetchTree('en', 'house');
//# sourceMappingURL=app.js.map