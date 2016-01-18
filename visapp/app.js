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
var ReactDOM = require('react-dom');
var astViewer_1 = require('./astViewer');
var react_router_1 = require('react-router');
var AstApp = (function (_super) {
    __extends(AstApp, _super);
    function AstApp(props) {
        _super.call(this, props);
    }
    AstApp.prototype.render = function () {
        var _a = this.props.params, lang = _a.lang, word = _a.word;
        var defaultLang = 'en';
        var defaultWord = 'walk';
        return (React.createElement(astViewer_1.AstViewer, {"lang": lang || defaultLang, "word": word || defaultWord}));
    };
    return AstApp;
})(React.Component);
function render() {
    ReactDOM.render((React.createElement(react_router_1.Router, {"history": react_router_1.browserHistory}, React.createElement(react_router_1.Route, {"path": "/(:lang/:word)", "component": AstApp}))), document.getElementById('content-container'));
}
render();
//# sourceMappingURL=app.js.map