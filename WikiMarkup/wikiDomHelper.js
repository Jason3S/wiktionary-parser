/**
 * Created by jason on 12/27/13.
 */

(function(){
    "use strict";

    var testFunctions = {
        '$eq': function(lhs, rhs) {
            return lhs == rhs;
        },
        '$ne': function(lhs, rhs) {
            return lhs != rhs;
        },
        '$in': function(lhs, rhs) {
            return rhs.indexOf(lhs) >= 0;
        },
        '$lt': function(lhs, rhs) {
            return lhs < rhs;
        },
        '$gt': function(lhs, rhs) {
            return lhs > rhs;
        },
        '$lte': function(lhs, rhs) {
            return lhs <= rhs;
        },
        '$gte': function(lhs, rhs) {
            return lhs >= rhs;
        },
        '$exists': function(lhs, rhs) {
            return (lhs !== undefined) == rhs;
        },
        '$not': function(lhs, rhs, fn) {
            return !fn(lhs, rhs);
        }
    };


    /**
     * Test to see if a node matches the conditions
     * @param n the node
     * @param c the conditions
     * @returns bool
     */
    function testNode(n, c) {
        var k;
        var m = false;

        // Do we have an exact match?
        if (n === c) {
            return true;
        }

        if (c instanceof RegExp) {
            return c.test(n);
        }

        if (typeof c == "object") {
            m = true;
            for (k in c) {
                if (c.hasOwnProperty(k)) {
                    if (testFunctions.hasOwnProperty(k)) {
                        m = m && testFunctions[k](n, c[k], testNode);
                    } else if (typeof n == "object" && n.hasOwnProperty(k)) {
                        m = m && testNode(n[k], c[k]);
                    } else {
                        m = m && testNode(undefined, c[k]);
                    }
                }
            }
        }
        else {
            return n == c;
        }

        return m;
    }

    /**
     * Find the first matching node otherwise null
     * @param node  the node to start with
     * @param c     the conditions
     * @returns Element || null
     * @note the search is depth first.
     */
    function findOne(node, c) {
        if (node === null || node === undefined) {
            return null;
        }

        if (testNode(node, c)) {
            return node;
        }

        var match = null;
        // Test children
        if (node.elements) {
            node.elements.some(function(e, i, a){
                match = findOne(e, c);
                return (match != null);
            });
        }

        return match;
    }

    /**
     * Find all matching nodes otherwise null
     * @param nodes  the nodes to start with
     * @param c     the conditions
     * @returns [Element] || []
     * @note the search is depth first.
     */
    function find(nodes, c) {
        if (!nodes) {
            return [];
        }

        nodes = (nodes instanceof Array) ? nodes : [nodes];

        var matches = [];

        nodes.forEach(function(node,i,a){
            if (testNode(node, c)) {
                matches.push(node);
            }

            matches = matches.concat(find(node.elements, c));
        });

        return matches;
    }

    /**
     * Find matching nodes from an array of nodes
     * @param nodes
     * @param c         The conditions
     * @returns {Array} of matching nodes
     */
    function filter(nodes, c) {
        var i;
        var matches = [];
        for (i = 0; i < nodes.length; ++i) {
            var node = nodes[i];
            if (testNode(node, c)) {
                matches.push(node);
            }
        }

        return matches;
    }

    /**
     * Find the nearest matching ancestor node
     * @param node  Node to start with
     * @param c     The conditions
     * @returns Element || null
     */
    function findAncestor(node, c) {
        if (testNode(node, c)) {
            return node;
        }

        if (node && node.parent) {
            return findAncestor(node.parent, c);
        }

        return null;
    }

    function getRoot(node) {
        while (node && node.parent) {
            node = node.parent;
        }

        return node;
    }


    function findPrevSibling(node, c, n) {
        node = node.prev || null;
        while (node && n !== 0) {
            if (testNode(node, c)) {
                return node;
            }
            node = node.prev || null;
            n = (n || 0) -1;
        }
        return null;
    }


    function findNextSibling(node, c, n) {
        node = node.next || null;
        while (node && n !== 0) {
            if (testNode(node, c)) {
                return node;
            }
            node = node.next || null;
            n = (n || 0) -1;
        }
        return null;
    }


    /**
     * This is a shallow text extraction.
     * @param node
     * @returns string
     */
    function extractText(nodes) {
        if (!(nodes instanceof Array)) {
            nodes = [nodes];
        }

        var text = '';
        nodes.forEach(function(node) {
            text += node.text || '';

            if (node.elements) {
                node.elements.forEach(function(e,i,a){
                    text += e.text || '';
                });
            }
        });

        return text;
    }


    /**************************************************************************/
    // The functions below are more helper functions for the formatting than the tree.

    function decorateText(text, lhs, rhs) {
        if ((/'|\[|\{/).test(text)) {
            return text;
        }

        return lhs + text + rhs;
    }

    function decorateTextItems(list, lhs, rhs) {
        var r = [];
        var i;
        for (i = 0; i < list.length; ++i) {
            r.push(decorateText(list[i], lhs, rhs));
        }

        return r;
    }

    function genLink(text) {
        return decorateText(text, "[[", "]]");
    }

    function genLinks(list) {
        return decorateTextItems(list, '[[', ']]');
    }

    function genBoldLink(text) {
        return decorateText(text, "'''[[", "]]'''");
    }

    function makeBold(text) {
        return decorateText(text, "'''", "'''");
    }

    function makeItalics(text) {
        return decorateText(text, "''", "''");
    }


    module.exports = {
        find: find,
        filter: filter,
        findOne: findOne,
        findAncestor: findAncestor,
        testNode: testNode,
        getRoot: getRoot,
        findPrevSibling: findPrevSibling,

        //
        extractText: extractText,

        // Formatting helper functions
        decorateText: decorateText,
        decorateTextItems: decorateTextItems,
        genLink: genLink,
        genLinks: genLinks,
        genBoldLink: genBoldLink,
        makeBold: makeBold,
        makeItalics: makeItalics
    };
}());