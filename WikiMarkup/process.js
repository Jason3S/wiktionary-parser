// process.js
"use strict";

var util = require('util');


function getTemplates(text) {
    var re = /\{\{[^\{\}]*?(?:\{\{[^\{\}]*?\}\}[^\{\}]*?)*?\}\}/gm;

    return text.match(re);
}

function getHeaders(text) {
    var re = /^==+[^=\n]+==+/gm;

    return text.match(re);
}

var activeLang = 'en';
var setOfTemplates = {};
var setOfHeaders = {name: 'root', influence: 0, count: 0, children: [], index: {}};

function groupingToOrderedKVPList(group, limit) {
    limit = limit || 1;
    var list = [], k, v;
    for (k in group) {
        if (group.hasOwnProperty(k)) {
            v = group[k];
            if (v.count >= limit) {
                list.push(v);
            }
        }
    }

    list.sort(function (a, b) {
        return (b.count - a.count) || (a.name < b.name ? -1 : 1);
    });

    return list;
}

function cleanGroupedHeaders(group, limit) {
    var children, i, c;

    function cleanAll(group) {
        delete group.index;

        while (group.children.length) {
            var c = group.children.pop();
            cleanAll(c);
        }
    }


    limit = limit || 1;

    // remove the index object.
    delete group.index;

    if (group.children.length) {
        children = group.children;

        // drop everyone and add back only the ones that pass the limit
        group.children = [];

        // clean and then sort.
        for (i = 0; i < children.length; ++i) {
            c = children[i];
            if (c.influence >= limit) {
                group.children.push(c);
                cleanGroupedHeaders(c, limit);
            }
            else {
                cleanAll(c);
            }
        }
    }
}


function sortGroupedHeaders(group) {
    if (group.children.length) {
        var children = group.children;
        var i;

        group.children.sort(function (a, b) {
            return (b.influence - a.influence) || (b.count - a.count) || (a.name < b.name ? -1 : 1);
        });

        // clean and then sort.
        for (i = 0; i < children.length; ++i) {
            sortGroupedHeaders(children[i]);
        }
    }
}


function groupHeaders(arr, group) {
    // Walk the array creating the nesting groups as we go.
    if (arr) {
        var reName = /[^=]+/;
        var reLevel = /^=+/;
        var stack = [];
        var i, e, name, level, n;
        for (i = 0; i < arr.length; ++i) {
            e = arr[i];
            name = e.match(reName)[0].trim();
            level = e.match(reLevel)[0].length;

            for (n = stack.length - 1; n >= 0; --n) {
                if (stack[n].level < level) {
                    break;
                }
            }
            stack.length = n + 1;

            stack.push({name: name, level: level});

            var g = group;
            var p = g;
            ++g.influence;
            for (n = 0; n < stack.length; ++n) {
                name = stack[n].name;
                if (!g.index[name]) {
                    g.index[name] = p = {name: name, influence: 0, count: 0, children: [], index: {}};
                    g.children.push(p);
                }
                else {
                    p = g.index[name];
                }

                ++p.influence;
                g = p;
            }

            ++p.count;
        }
    }
}


function filterGroupedTemplates(group, limit, keepIndex) {
    keepIndex = keepIndex || false;

    function cleanAll(t) {
        delete t.index;

        if (t.children) {
            while (t.children.length) {
                var c = t.children.pop();
                cleanAll(c);
            }
        }

        delete t.children;
    }

    function filter(t) {
        if (t.count < limit) {
            cleanAll(t);
        }
        else {
            if (keepIndex) {
                t.index = {};
            }
            else {
                delete t.index;
            }

            if (t.children) {
                var children = t.children;
                var i;
                t.children = [];
                for (i = 0; i < children.length; ++i) {
                    var c = children[i];
                    if (c.count < limit) {
                        cleanAll(c);
                    }
                    else {
                        t.children.push(c);
                        if (keepIndex) {
                            t.index[c.name] = c;
                        }
                    }
                }

                if (!keepIndex && !t.children.length) {
                    delete t.children;
                }
            }
        }
    }

    if (group.templates) {
        var templates = group.templates;
        var i;
        group.templates = [];
        if (keepIndex) {
            group.index = {};
        }
        else {
            delete group.index;
        }
        for (i = 0; i < templates.length; ++i) {
            var t = templates[i];
            filter(t);
            if (t.count >= limit) {
                group.templates.push(t);
                if (keepIndex) {
                    group.index[t.name] = t;
                }
            }
        }
    }
}

function sortGroupedTemplates(group) {
    function sortTemplates(templates) {
        var i;
        if (templates) {
            templates.sort(function (a, b) {
                return (b.count - a.count) || (a.name < b.name ? -1 : 1);
            });

            for (i = 0; i < templates.length; ++i) {
                sortTemplates(templates[i].children);
            }
        }
    }

    sortTemplates(group.templates);
}

function groupTemplates(arr, group) {
    var reTBody = /^\{\{(.*)\}\}$/;
    var i;

    // Setup group
    group.templates = group.templates || [];
    group.index = group.index || {};

    if (arr && arr.length) {
        for (i = 0; i < arr.length; ++i) {
            var m = reTBody.exec(arr[i]);
            if (m && m.length == 2) {
                var tBody = m[1];
                var parts = tBody.split('|');
                var t, s, j;
                var name = parts[0];
                var p;
                t = group.index[name];
                if (!t) {
                    t = {count: 0, name: name, index: {}, children: []};
                    group.index[name] = t;
                    group.templates.push(t);
                }

                ++t.count;

                for (j = 1; j < parts.length; ++j) {
                    name = parts[j];
                    p = name.indexOf('=');  // capture assigned param names, drop the value.
                    if (p >= 0) {
                        name = name.substr(p + 1);
                    }
                    p = t.index[name];
                    if (!p || !t.index.hasOwnProperty(name)) {
                        p = {count: 0, name: name, pos: {}};
                        t.index[name] = p;
                        t.children.push(p);
                    }
                    if (!p || !p.pos) {
                        var stophere = 1;
                    }
                    p.pos[j] = (p.pos[j] || 0) + 1;
                    ++p.count;
                }
            }
        }
    }
}


function countOccurances(arr, group) {
    if (arr) {
        var reName = /[^=]+/;
        var reLevel = /^=+/;
        var i;
        for (i = 0; i < arr.length; ++i) {
            var e = arr[i];
            var name = e.match(reName)[0];
            var level = e.match(reLevel)[0];

            var g = group[name] = group[name] || {name: name, levels: {}, count: 0};

            ++g.count;
            g.levels[level] = (g.levels[level] || 0) + 1;
        }
    }
}

var aggregateWikiDataCount = 0;

function aggregateWikiData(err, doc) {
    if (err || doc === null) {
        // we are done.
        if (1) {
            cleanGroupedHeaders(setOfHeaders, 100);
            // setOfHeaders.children.length = setOfHeaders.children.length ? 1 : 0; 
            sortGroupedHeaders(setOfHeaders);
            util.print(util.inspect(setOfHeaders, {colors: true, depth: 8}));
        }

        if (0) {
            filterGroupedTemplates(setOfTemplates, 100);
            sortGroupedTemplates(setOfTemplates);
            util.print(util.inspect(setOfTemplates, {colors: true, depth: 8}));
        }

        util.print('\n');
        //console.dir(setOfHeaders);
        process.exit();
    }
    else {
        var d;
        if (doc.revisions && doc.revisions[0] && (d = doc.revisions[0]['*'])) {
            // groupHeaders(getHeaders(d), setOfHeaders);
            groupTemplates(getTemplates(d), setOfTemplates);
            ++aggregateWikiDataCount;
            if (aggregateWikiDataCount > 10000) {
                aggregateWikiDataCount = 0;
                filterGroupedTemplates(setOfTemplates, 2, true);
            }
        }
    }
}


var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1", 27017, {});
new mongodb.Db('wiktionary', server, {w: 1}).open(function (error, client) {
    if (error) {
        throw error;
    }
    var collection = new mongodb.Collection(client, 'wikiwords');
    var it = collection.find({lang: activeLang});
    it.each(aggregateWikiData);
});
