// wikimarkupelement.js

(function (module, require) {
    "use strict";

    function Element(t) {
        this.parent = null;
        this.eType = t;
    }

    Element.prototype.appendText = function (text, lang) {
        var e = this.lastChild();

        if (e && e.eType == 'text' && e.lang == lang) {
            e.text = e.text + text;
        } else {
            e = this.create('text');
            e.text = text;
            e.lang = lang;
        }

        return this;
    };

    Element.prototype.lastChild = function () {
        if (this.elements === undefined) {
            return null;
        }
        var len = this.elements.length;
        return len > 0 ? this.elements[len - 1] : null;
    };

    Element.toText = function (element) {
        var text = '', i;

        if (element.text) {
            text = element.text;
        }

        if (element.elements) {
            for (i = 0; i < element.elements.length; ++i) {
                text += Element.toText(element.elements[i]);
            }
        }

        return text;
    };

    Element.prototype.toText = function () {
        return Element.toText(this);
    };

    Element.prototype.create =
    Element.prototype.createChild = function(t) {
        var last = this.lastChild();
        var e = new Element(t);
        e.parent = this;
        this.elements = this.elements || [];
        this.elements.push(e);

        if (last) {
            e.prev = last;
            last.next = e;
        }

        return e;
    };

    Element.prototype.detach = function() {
        var p = this.parent;
        if (p) {
            // Unhook from the parent
            var i = p.elements.lastIndexOf(this);
            if (i >= 0) {
                p.elements.splice(i, 1);
            }
        }

        // disconnect the neighbors
        var next = this.next;
        var prev = this.prev;
        if (next) {
            next.prev = prev;
        }
        if (prev) {
            prev.next = next;
        }
        this.next = null;
        this.prev = null;
    };

    Element.prototype.appendChild = function(e) {
        if (e === null) {
            return;
        }

        e.detach();

        e.parent = this;
        var prev = this.lastChild();
        this.elements = this.elements || [];
        this.elements.push(e);
        e.next = null;
        e.prev = prev;
        if (prev) {
            prev.next = e;
        }
    };

    /**
     * This function is used to clean an element tree so it can be stored.
     *
     */
    Element.prototype.cleanTree = function() {
        if (this.elements) {
            this.elements.forEach(function(e) {e.cleanTree();});
        }

        delete this.parent;
        delete this.next;
        delete this.prev;
    };

    module.exports = Element;

}(module, require));