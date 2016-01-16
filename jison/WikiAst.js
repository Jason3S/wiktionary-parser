/**
 * Created by jasondent on 09/01/2016.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var WikiAst;
(function (WikiAst) {
    var AstEvalContext = (function () {
        function AstEvalContext(node, info) {
            this.node = node;
            this.info = info;
        }
        AstEvalContext.eval = function (node, info, fn, values) {
            return fn.apply(new AstEvalContext(node, info), values);
        };
        return AstEvalContext;
    })();
    var GenericNode = (function () {
        function GenericNode(children, type, fn, limit) {
            if (limit === void 0) { limit = 0; }
            this.children = children;
            this.type = type;
            this.fn = fn;
            this.limit = limit;
        }
        GenericNode.prototype.eval = function (info) {
            var seq = _(this.children).map(function (c) { return c.eval(info); });
            return AstEvalContext.eval(this, info, this.fn, seq.value());
        };
        GenericNode.prototype.getType = function () {
            return this.type;
        };
        return GenericNode;
    })();
    WikiAst.GenericNode = GenericNode;
    var GenericLeaf = (function () {
        function GenericLeaf(type, value, fn) {
            if (fn === void 0) { fn = function (value) { return value; }; }
            this.type = type;
            this.value = value;
            this.fn = fn;
        }
        GenericLeaf.prototype.eval = function (info) {
            return this.fn(this.value);
        };
        GenericLeaf.prototype.getType = function () {
            return this.type;
        };
        return GenericLeaf;
    })();
    WikiAst.GenericLeaf = GenericLeaf;
    var TransclusionNode = (function () {
        function TransclusionNode(children, type) {
            this.children = children;
            this.type = type;
        }
        TransclusionNode.prototype.eval = function (info) {
            var isTranscluded = info.isTranscluded;
            var isIncluded = (isTranscluded && this.type == 'includeonly')
                || (!isTranscluded && this.type == 'noinclude')
                || (this.type == 'onlyinclude');
            if (!isIncluded) {
                return '';
            }
            var seq = _(this.children).map(function (c) { return c.eval(info); }).value();
            if (seq.length == 1) {
                return seq[0];
            }
            return seq.join('');
        };
        TransclusionNode.prototype.getType = function () {
            return this.type;
        };
        return TransclusionNode;
    })();
    WikiAst.TransclusionNode = TransclusionNode;
    var PageParamContext = (function (_super) {
        __extends(PageParamContext, _super);
        function PageParamContext(node, info) {
            _super.call(this, node, info);
            this.node = node;
            this.info = info;
        }
        PageParamContext.normalizePageParam = function (pageParams) {
            var params = [undefined];
            var namedParamRegEx = /^([a-zA-Z0-9]+)[=](.*)$/;
            for (var i in pageParams) {
                if (pageParams.hasOwnProperty(i)) {
                    var p = '' + pageParams[i];
                    var m = p.match(namedParamRegEx);
                    if (m) {
                        params[m[1]] = m[2];
                    }
                    else {
                        params.push(p);
                    }
                }
            }
            return params;
        };
        PageParamContext.prototype.getPageParam = function (name, alternate) {
            name = ('' + name).trim();
            var pageName = this.info.page;
            var pageParams = PageParamContext.normalizePageParam(this.info.params);
            if (alternate === null) {
                alternate = pageName;
            }
            if (alternate === undefined) {
                alternate = '{{{' + name + '}}}';
            }
            var p = pageParams[name];
            if (p === undefined) {
                return alternate;
            }
            return p;
        };
        return PageParamContext;
    })(AstEvalContext);
    WikiAst.fnMap = {
        "+": { fn: function (a, b) { return Number(a) + Number(b); }, limit: 2 },
        "-": { fn: function (a, b) { return Number(a) - Number(b); }, limit: 2 },
        "*": { fn: function (a, b) { return Number(a) * Number(b); }, limit: 2 },
        "/": { fn: function (a, b) { return Number(a) / Number(b); }, limit: 2 },
        "pow": { fn: Math.pow, limit: 2 },
        "ceil": { fn: Math.ceil, limit: 1 },
        "floor": { fn: Math.floor, limit: 1 },
        "||": { fn: function (a, b) { return a || b; }, limit: 2 },
        "&&": { fn: function (a, b) { return a && b; }, limit: 2 },
        "if": { fn: function (a, b, c) { return a ? b : c; }, limit: 3 },
        "ifeq": { fn: function (a, b, c, d) { return ((a == b) || (a - b == 0)) ? c : d; } },
        content: { fn: function () {
                var children = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    children[_i - 0] = arguments[_i];
                }
                return children.length == 1 ? children[0] : children.join('');
            } },
        pageParam: { fn: PageParamContext.prototype.getPageParam, limit: 2 }
    };
    function makeNodeMap(type) {
        var fnMapItem = WikiAst.fnMap[type];
        return function (c) { return new GenericNode(c, type, fnMapItem.fn, fnMapItem.limit); };
    }
    var nodeMap = {
        "+": makeNodeMap("+"),
        "-": makeNodeMap("-"),
        "*": makeNodeMap("*"),
        "/": makeNodeMap("/"),
        "pow": makeNodeMap("pow"),
        "ceil": makeNodeMap("ceil"),
        "floor": makeNodeMap("floor"),
        "||": makeNodeMap("||"),
        "&&": makeNodeMap("&&"),
        "if": makeNodeMap("if"),
        "ifeq": makeNodeMap("ifeq"),
        includeonly: function (c) { return new TransclusionNode(c, 'includeonly'); },
        noinclude: function (c) { return new TransclusionNode(c, 'noinclude'); },
        onlyinclude: function (c) { return new TransclusionNode(c, 'onlyinclude'); },
        content: makeNodeMap("content"),
        pageParam: makeNodeMap("pageParam")
    };
    function node(type, children) {
        var fn = nodeMap[type];
        if (!fn) {
            throw new Error('Unknown Type: ' + type);
        }
        return fn(children);
    }
    WikiAst.node = node;
    function leaf(value, type) {
        if (type === void 0) { type = 'leaf'; }
        return new GenericLeaf(type, value);
    }
    WikiAst.leaf = leaf;
    function convertAst(bAst) {
        if (bAst.v !== undefined || bAst.c === undefined) {
            return bAst.t ? leaf(bAst.v, bAst.t) : leaf(bAst.v);
        }
        var c = _(bAst.c || []).map(convertAst).value();
        return node(bAst.t, c);
    }
    WikiAst.convertAst = convertAst;
})(WikiAst = exports.WikiAst || (exports.WikiAst = {}));
//# sourceMappingURL=WikiAst.js.map