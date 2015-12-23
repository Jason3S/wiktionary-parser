/**
 * Created by jason on 1/5/14.
 */
(function(){
    "use strict";

    function ProcessingState(element, tokens, title, lang) {
        this.element = element;
        this.tokens = tokens;
        this.title = title;
        this.lang = lang;
        this.pos = 0;
        this.titles = [];
        this.markupElements = null;
    }

    // We don't want to process any more tokens
    ProcessingState.prototype.stopFurtherProcessing = function() {
        this.pos = this.tokens.length;
    }

    ProcessingState.prototype.appendText = function(text, lang) {
        lang = lang || this.lang;
        return this.element.appendText(text, lang);
    };

    ProcessingState.prototype.getCurrentToken = function() {
        return this.tokens[this.pos];
    };

    ProcessingState.prototype.advancePosition = function(n) {
        n = n || 1;
        this.pos += n;
    };

    ProcessingState.prototype.getNextToken = function() {
        return this.tokens[this.pos+1];
    };

    ProcessingState.prototype.lookAhead = function(n) {
        n = n || 1;
        var p = this.pos + n;
        if (p < this.tokens.length) {
            return this.tokens[p];
        }
        return null;
    };

    ProcessingState.prototype.hasNext = function() {
        return this.pos < this.tokens.length-1;
    };

    ProcessingState.prototype.skipToken = function(tokenName) {
        var t = this.getNextToken();
        if (t && t.token == tokenName) {
            this.advancePosition();
            return true;
        }
        return false;
    };

    ProcessingState.prototype.findProperDepthInTree = function(depth) {
        // move up the structure tree until the depth in the tree is less than depth

        var e = this.element;
        var currentDepth = this.currentDepth;

        // We need to change the active element;
        while (currentDepth >= depth) {
            e = e.parent;
            this.titles.pop();
            if (e.depth !== undefined) {
                currentDepth = e.depth;
            }
        }

        this.element = e;
        this.currentDepth = currentDepth;
        this.lang = e.lang || this.lang;
    };

    ProcessingState.prototype.createSection = function(depth, text, name, sType) {
        this.findProperDepthInTree(depth);

        var e = this.element.create('section');
        e.depth = depth;
        e.text = text;
        e.name = name;
        e.sType = sType;
        e.lang = this.lang;
        this.currentDepth = depth;
        this.titles.push(text);
        this.skipToken('LF');
        this.element = e;

        return e;
    };

    // Creates an new child element
    ProcessingState.prototype.createElement = function(eType) {
        return this.element.create(eType);
    };

    module.exports = ProcessingState;
}());
