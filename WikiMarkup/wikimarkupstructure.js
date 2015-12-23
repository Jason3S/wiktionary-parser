/**
 * Created by jason on 12/24/13.
 */
(function(){
    "use strict";

    var Element = require('./wikimarkupelement.js');
    var wmpEnglish = require('./wmpEnglish.js');
    var wmpDutch = require('./wmpDutch.js');
    var wmpGerman = require('./wmpGerman.js');
    var wmpFrench = require('./wmpFrench.js');
    var wDom = require('./wikiDomHelper.js');
    var ProcessingState = require('./processingState.js');

    var wmpForLang = {
        'en': wmpEnglish,
        'nl': wmpDutch,
        'de': wmpGerman,
        'fr': wmpFrench
    };


    var supportedLanguages = ['en','nl','de','fr','es','sv']; // ['en','nl','de','fr','es','sv','it','pr'];

    function removeParentReferences(root) {
        root.cleanTree();
        return root;
    }


    function extractStructure(tokenSet, lang, title, doPostProcessing) {

        var root = new Element('root');
        root.depth = 0;
        root.title = title;
        root.lang = lang;
        var processTokens;



        var rootState = new ProcessingState(root, tokenSet, title, lang);

        var templateProcessingFunctions = {
            'en': (wmpForLang.en || {}).templateProcessingFunctions || [],
            'nl': (wmpForLang.nl || {}).templateProcessingFunctions || [],
            'de': (wmpForLang.de || {}).templateProcessingFunctions || [],
            'fr': (wmpForLang.fr || {}).templateProcessingFunctions || [],
            'es': (wmpForLang.es || {}).templateProcessingFunctions || [],
            'sv': (wmpForLang.sv || {}).templateProcessingFunctions || [],
            'xx': 0
        };

        var sectionFilter = {
            'en': {whiteList: /^English/, blackList: /.*/},
            'nl': null,
            'de': null,
            'fr': null,
            'es': null,
            'sv': null,
            'xx': 0
        };

        var postProcessingFunctions = {
            'en': wmpEnglish.postProcessStructure,
            'nl': function(){},
            'de': function(){},
            'fr': wmpFrench.postProcessStructure,
            'es': function(){},
            'sv': function(){},
            'xx': 0
        };

        function verifyToken(t, expectedTokenType) {
            if (t.token != expectedTokenType) {
                console.error('Parse Error: ' + t.token + ' != ' + expectedTokenType);
                return false;
            }
            return true;
        }

        function copyTokens(tokens, iStartPos, stopToken) {
            var copy = [];
            var i;

            for (i = iStartPos; i < tokens.length && tokens[i].token != stopToken; ++i) {
                copy.push(tokens[i]);
            }

            return copy;
        }

        function skipSection(state) {
            var token = state.getCurrentToken();
            verifyToken(token, 'Section');
            var depth = token.depth;

            while (state.hasNext()) {
                token = state.getNextToken();
                if (token.token == 'Section' && token.depth <= depth) {
                    break;
                }
                state.advancePosition();
            }
        }

        function processSection(state) {
            var token = state.getCurrentToken();
            verifyToken(token, 'Section');
            // find out position in the tree
            var depth = token.depth;
            var title = token.text;

            // find out position in the tree
            state.findProperDepthInTree(depth);

            var filter = sectionFilter[lang];

            if (filter) {
                var titles = state.titles.concat(title).join('§');
                if (!filter.whiteList.test(titles) && filter.blackList.test(titles)) {
                    skipSection(state);
                    return;
                }
            }

            state.createSection(depth, title, title, 'header');
        }

        function processText(state) {
            var t = state.getCurrentToken();
            verifyToken(t, 'Text');
            state.appendText(t.value);
        }

        function processLF(state) {
            var e;
            verifyToken(state.getCurrentToken(), 'LF');
            // Fix up any pending markup.
            if (state.markupElements && state.markupElements.length > 0) {
                // Set the current state element to the parent of the outer most markup.
                e = state.markupElements[0];
                state.element = e.parent;
            }
            state.markup = 0;
            if (state.pos > 0 && state.tokens[state.pos - 1].token == 'LF') {
                state.element.create('lf');
            }
            /*
             else {
             e = state.element.create('br');
             }
             */

            // reset the language at the end of a line.
            state.lang = lang;
        }

        function processList(state) {
            var pos = state.pos;
            var token = state.tokens[pos];
            verifyToken(token, 'List');

            var parent = state.element;
            var listTypes = token.value;
            var i = 0;
            var listElem = parent;

            var e = parent.lastChild();
            // Find the right list to put it in.
            while (e && e.eType == 'list' && e.listType == listTypes[i]) {
                // Get the last list item
                e = e.lastChild();
                listElem = e;
                // Get the last element of the list item
                e = e.lastChild();
                ++i;
            }

            if (i < listTypes.length) {
                for (i; i < listTypes.length; ++i) {
                    e = listElem.create('list');
                    e.listType = listTypes[i];
                    listElem = e.create('li');
                }
            }
            else {
                listElem = listElem.parent.create('li');
            }


            var subTokens = copyTokens(state.tokens, pos + 1, 'LF');

            var listState = new ProcessingState(listElem, subTokens, '', state.lang);
            listState.depth = state.depth;

            processTokens(listState);

            state.pos += subTokens.length + 1;
        }

        function processTemplate(state) {
            verifyToken(state.getCurrentToken(), 'Template');
            var t = state.getCurrentToken();
            var fnSet = templateProcessingFunctions[lang];
            var tname = t.name;
            var fn, i;

            for (i = 0; i < fnSet.length; ++i) {
                var f = fnSet[i];
                if (f.m.test(tname)) {
                    fn = f.fn;
                    break;
                }
            }

            if (fn) {
                fn(t, state);
            }
            else {
                var e = state.element.create('template');
                e.text = t.value;
            }
        }

        function processHtml(state) {
            verifyToken(state.getCurrentToken(), 'html');
            var t = state.getCurrentToken();
            var raw = t.value;

            var reHtmlName = /^<\s*(\/?\w+)/;

            var m = reHtmlName.exec(raw);


            if (!m) {
                return;
            }

            var htmlName = m[1];

            switch (htmlName) {
                case 'br':
                    state.element.create('br');
                    break;
                default:
                    state.element.appendText(raw, lang);
                    break;
            }

        }

        function processHtmlEnd(state) {
            verifyToken(state.getCurrentToken(), '/html');
            var t = state.getCurrentToken();
            var raw = t.value;
            state.element.appendText(raw, lang);
        }

        function processComment(state) {
            verifyToken(state.getCurrentToken(), '/*');
            var pos = state.pos;
            var titleTokens = copyTokens(state.tokens, pos + 1, '*/');
            state.pos += titleTokens.length + 1;
        }

        function processRefMarker(state) {
            verifyToken(state.getCurrentToken(), 'XRef');
            var t = state.getCurrentToken();
            var e = state.createElement('xref');
            e.ref = t.ref;
            e.text = t.text;
        }

        processTokens = function (state) {
            var t;
            while ((t = state.getCurrentToken()) !== undefined) {
                // console.log(t.token);
                switch (t.token) {
                    case 'Section':
                        processSection(state);
                        break;
                    case 'Text':
                        processText(state);
                        break;
                    case 'List':
                        processList(state);
                        break;
                    case 'Template':
                        processTemplate(state);
                        break;
                    case 'LF':
                        processLF(state);
                        break;
                    case 'html':
                        processHtml(state);
                        break;
                    case '/html':
                        processHtmlEnd(state);
                        break;
                    case '/*':
                        processComment(state);
                        break;
                    case 'XRef': // Reference Marker (Can be either the source or the destination within the page)
                        processRefMarker(state);
                        break;
                }

                state.advancePosition();
            }
        };


        processTokens(rootState);

        if (doPostProcessing) {
            postProcessingFunctions[lang](root);
        }

        return root;
    }

    function extractTranslationsFromStructure(root) {
        var allTr = wDom.find(root, {eType:'tr', lang: {"$in":supportedLanguages}});

        var trMap = {};

        var translations = {
            word: root.title,
            lang: root.lang,
            trSets: []
        };

        allTr.forEach(function(e,i,a){
            var k = '@' + e.def;
            if (!trMap[k]) {
                var t = {def: e.def, trans:[]};
                trMap[k] = t;
                translations.trSets.push(t);
            }
            trMap[k].trans.push({lang: e.lang, text: e.text, gender: e.gender});
        });

        return translations;
    }

    function extractTranslationsFromStructureFlat(root) {
        var wmp = wmpForLang[root.lang];

        if (wmp && wmp.extractTranslations) {
            return wmp.extractTranslations(root, supportedLanguages);
        }

        var allTr = wDom.find(root, {eType:'tr', lang: {"$in":supportedLanguages}});

        var word = root.title;
        var lang = root.lang;

        var translations = [];

        allTr.forEach(function(e,i,a){
            translations.push({
                lang: lang,
                word: word,
                def: e.def,
                pos: e.pos,
                tlang: e.lang,
                tword: e.text,
                tgender: e.gender
            });
        });

        return translations;
    }

    module.exports.extractStructure = extractStructure;
    module.exports.removeParentReferences = removeParentReferences;
    module.exports.extractTranslationsFromStructure = extractTranslationsFromStructure;
    module.exports.extractTranslationsFromStructureFlat = extractTranslationsFromStructureFlat;

}(module, require));