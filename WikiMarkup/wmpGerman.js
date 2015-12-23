/**
 * Created by jason on 1/17/14.
 */

(function (exports, require) {
    "use strict";

    var sectionTemplates = [
        {m: '=deu=',        d:2, n: 'de',            t: 'German',    sType: 'page'},
        {m: '-info-',       d:4, n: 'info',          t: 'Information',   sType: 'info'},
        {m: 'Aussprache',   d:4, n: 'pron',          t: 'Pronunciation', sType: 'Header'},
        {m: 'Bedeutungen',  d:4, n: 'defs',          t: 'Definitions',   sType: 'defs'},
        {m: 'Worttrennung', d:5, n: 'syll',          t: 'Syllables',     sType: 'rel'},
        {m: '-note-',       d:5, n: 'note',          t: 'Note',          sType: 'info'},
        {m: '-rel-',        d:5, n: 'rel',           t: 'Related Terms', sType: 'rel'},
        {m: 'Übersetzungen',d:5, n: 'trans',         t: 'Translations',  sType: 'trans'},
        {m: '-prov-',       d:5, n: 'idiom',         t: 'Idioms',        sType: 'rel'},
        {m: 'Synonyme',     d:5, n: 'syn',           t: 'Synonyms',      sType: 'rel'},
        {m: 'Sinnverwandte Wörter', d:5, n: 'syn',   t: 'Synonyms',      sType: 'rel'},
        {m: 'Redewendungen',d:5, n: 'expr',          t: 'Expressions',   sType: 'rel'},
        {m: 'Gegenwörter',  d:5, n: 'ant',           t: 'Antonyms',      sType: 'rel'},
        {m: 'Abkürzungen',  d:5, n: 'abb',           t: 'Abbreviations', sType: 'rel'},
        {m: 'Herkunft',     d:5, n: 'etym',          t: 'Entomology',    sType: 'rel'},
        {m: 'Unterbegriffe',d:5, n: 'hypo',          t: 'Hyponym',       sType: 'rel'},
        {m: 'Oberbegriffe', d:5, n: 'hyper',         t: 'Hypernym',      sType: 'rel'},
        {m: 'Charakteristische Wortkombinationen', d:5, n: 'rel', t: 'Related Terms',      sType: 'rel'},
        {m: 'Wortbildungen',d:5, n: 'drv',           t: 'Derivative',    sType: 'rel'},
        {m: 'Beispiele',    d:5, n: 'examples',      t: 'Examples',      sType: 'rel'},
        {m: 'Referenzen',   d:5, n: 'refs',          t: 'References',    sType: 'rel'}

    ];

    var posTemplates = [
        {m: 'Substantiv', pos: 'noun',        t: "Substantiv"},
        {m: 'Verb',       pos: 'verb',        t: "Verb"},
        {m: 'Adjektiv',   pos: 'adjective',   t: "Adjektiv"},
        {m: 'Adverb',     pos: 'adverb',      t: "Adverb"}
    ];

    var posWordFormTemplates = [
        {m: 'Deutsch Substantiv Übersicht',      pos: 'noun'},
        {m: 'Deutsch adjektivische Deklination', pos: 'noun'},
        {m: 'Deutsch Adjektiv Übersicht',        pos: 'adjective'}

    ];

    var posModifierTemplates = [
        {m: 'Pl.',                  t: "Plural",                n: 'plural'},
        {m: 'Männliche Wortformen', t: "Männliche Wortformen",  n: 'masculine'},
        {m: 'trans.',               t: 'transitiv',             n: 'transitive'},
        {m: 'intrans.',             t: "intransitiv",           n: 'intransitive'},
        {m: 'ugs.',                 t: "umgangssprachlich",     n: 'colloquial'},
        {m: 'refl.',                t: "reflexiv",              n: 'reflexive'}

    ];

    var langModifier = [
        {m: 'nl', t: 'Dutch'},
        {m: 'en', t: 'English'},
        {m: 'de', t: 'German'},
        {m: 'fr', t: 'French'},
        {m: 'es', t: 'Spanish'},
        {m: 'sv', t: 'Swedish'},
        {m: 'it', t: 'Italian'},
        {m: 'pt', t: 'Portuguese'}
    ];

    var tokensToSkip = [
        'Absatz',  // Paragraph marker -- for formatting only
        '='         // Horizontal break, skip for now.
    ];


    var wDom = require('./wikiDomHelper.js');

    var lang = 'de';
    var templateProcessingFunctions = [];

    function composeListTemplate(list, fnProcessTemplate) {
        var map = {};
        var i = 0;
        for (i = 0; i < list.length; ++i) {
            var s = list[i];
            map['@'+s] = 1;
        }

        return {
            m: { test: function(tokenName) { return map['@'+tokenName] ? true : false; }},
            fn: fnProcessTemplate
        };
    }

    function composeGroupTemplates(group, fnProcessTemplate) {
        var map = {};
        var i = 0;
        for (i = 0; i < group.length; ++i) {
            var s = group[i];
            map[s.m] = s;
        }

        return {
            m: { test: function(tokenName) { return map[tokenName] ? true : false; }},
            fn: function(token, state) { fnProcessTemplate(token, state, map[token.name]);}
        };
    }

    function processSection(token, state, section) {
        state.createSection(section.d, section.t, section.n, section.sType);
    }

    function processPartOfSpeechHeader(token, state) {
        var forms = token.plist;
        var pos = token.plist[0];
        var lang = token.plist[1];

        if (lang != 'Deutsch') {
            // Stop processing.  It is no longer German.
            state.pos = state.tokens.length;
        }

        var i;
        var match;
        for (i = 0; i < posTemplates.length && !match; ++i) {
            var t = posTemplates[i];
            match = t.m == pos ? t : null;
        }

        if (!match) {
            return;
        }

        var e = state.createSection(3, match.t, match.pos, 'pos');
        e.pos = match.pos;

        var t1 = state.lookAhead(1);
        var t2 = state.lookAhead(2);

        // Sometime the part of speach is followed by the gender.  Try to capture that.
        if (t1 && t2 && t1.token == 'Text' && t2.token == 'Template' && t2.name.match(/^[mfnc]$/)) {
            e.text += t1.value + '(' + t2.name + ')';
            e.gender = t2.name;
            state.advancePosition(2);
        }
    }

    function processWordForms(token, state, match) {
        var values = token.argv.slice(1);
        var forms = [];
        var i;
        for (i = 0; i < values.length; ++i) {
            var parts = values[i].trim().split('=');
            forms.push(parts.pop());
        }

        var e = state.createElement('pos');
        e.name = match.m;
        e.pos = match.pos;
        e.forms = values;
        e.lang = state.lang;
        e.text = '';

        if (forms) {
            forms = forms.filter(function(a) { return (a + ' ').trim() !== '';});
            // forms = wDom.genLinks(forms);
            forms = ('('+forms.join(', ')+')').replace(/(, )+/g, ', ');
            e.text = forms;
        }
    }



    /**
     * Do nothing with the token and skip any trailing 'LF' tokens.
     */
    function skipToken(token, state) {
        state.skipToken('LF');
    }

    function singleAttribute(token, state) {
        state.appendText('('+token.name+')');
    }

    templateProcessingFunctions.push(composeGroupTemplates(sectionTemplates, processSection));
    templateProcessingFunctions.push({m:/^Wortart$/, fn: processPartOfSpeechHeader});
    templateProcessingFunctions.push(composeGroupTemplates(posWordFormTemplates, processWordForms));

    templateProcessingFunctions.push(composeGroupTemplates(posModifierTemplates, function(token, state, match){
        state.appendText('('+match.t+')');
    }));

    templateProcessingFunctions.push({
        m: /Ü-Tabelle/,
        fn: function (token, state) {
            var wikiMarkupParser = require('./wikimarkupparser.js');

            var tList = [];
            var i;
            var fnFilter = function(e) { return e.trim() ? true : false; };

            // Extract the list of translations from the params.
            for (i = 1; i < token.argv.length; ++i) {
                var sList = token.argv[i].split('=')[1] || '';
                tList = tList.concat(sList.split('\n').filter(fnFilter));
            }

            var raw = tList.join('\n');
            var subTree = wikiMarkupParser.parseEmbedded(raw, lang, state.title);
            subTree.eType = 'tran';
            subTree.name = 'trans';
            subTree.text = '';
            subTree.lang = 'en';
            state.element.appendChild(subTree);
        }
    });


    templateProcessingFunctions.push({
        m:  /^Üx*$/,
        fn: function (token, state) {
            var plist = token.plist;
            var tlang = plist[0];
            var text = plist[2] || plist[1];
            var e = state.element.create('tr');
            e.lang = tlang;
            e.text = text;
            e.gender = null;
            e.def = null;
            e.pos = null;
        }
    });

    templateProcessingFunctions.push({
        m:  /^trans\-top[0-9]*$/,
        fn: function (token, state) {
            var tranBlock = state.element.create('tran');
            tranBlock.text = (token.argv[1] || '').replace(/^[0-9]+.\s*/,'');
            tranBlock.lang = lang;
            state.element = tranBlock;
            state.skipToken('LF');
        }
    });

    templateProcessingFunctions.push({
        m:  /^trans\-bottom[0-9]*$/,
        fn: function (token, state) {
            if (state.element.eType == 'tran') {
                state.element = state.element.parent;
            }
            state.skipToken('LF');
        }
    });

    templateProcessingFunctions.push({
        m:  /^trans\-mid[0-9]*$/,
        fn: function (token, state) {
            state.skipToken('LF');
        }
    });

    // part of speech gender
    templateProcessingFunctions.push({
        m:  /^(m|f|n|c|p)$/,
        fn: function(token, state) {
            var e = state.createElement('gender');
            e.text = '(' + token.value + ')';
            e.gender = token.value;
        }
    });

    templateProcessingFunctions.push(composeGroupTemplates(langModifier, function(token, state, match) {
        state.appendText('('+match.t+')', 'en');  // These words happen to be in english.
        // Set the current language.
        state.lang = match.m;
    }));


    templateProcessingFunctions.push(composeListTemplate(tokensToSkip, skipToken));

    // Skip top level languages
    templateProcessingFunctions.push({m:/\=[a-zA-Z0-9]+=/, fn: function (token, state) {
        state.stopFurtherProcessing();
    }});

    function findAttachedXRef(elem) {
        return wDom.findPrevSibling(elem, {eType:'xref'});
    }

    function findPos(elem) {
        return wDom.findAncestor(elem, {sType:'pos'});
    }

    function findRelatedDefs(elem) {
        // find the definition section
        var defElem = wDom.findAncestor(elem, {sType:'defs'});

        // Get the first list
        var defList = wDom.findOne(defElem, {eType:'list'});

        // Get all the list items that are immediate members of this list.
        var listItems = wDom.find(defList, {eType:'li', parent: defList});

        // Find only xrefs that are at the front of the list.
        var xrefs = wDom.find(listItems, {eType:'xref', parent: {'$in':listItems}, prev: undefined});
        //var xrefs = wDom.find(listItems, {eType:'xref', parent: {'$in':listItems}, prev:{'$exists':false}});

        var defs = [];

        xrefs.forEach(function(e,i,a){
            var def = wDom.extractText(e.parent).trim();
            // Remove the xref from the front.
            def = def.replace(/^\[[0-9\-,]*\]\s*/, '');
            defs[e.ref] = def;
        });

        return defs;
    }

    function extractTranslations (root, supportedLanguages) {
        var allTr = wDom.find(root, {eType:'tr', lang: {"$in":supportedLanguages}});

        var word = root.title;
        var lang = root.lang;

        var translations = [];

        allTr.forEach(function(e,i,a){
            if (!e.text || e.text.trim() === '') {
                return;
            }


            var tranContainer = wDom.findAncestor(e, {name: 'trans'});
            if (!tranContainer) {
                return;  // Skip translations that do not have a tran container. (explicitly etym)
            }

            var eXrefDef = findAttachedXRef(e);
            var defs = findRelatedDefs(e);
            var dDef = e.def || null;
            var pos = findPos(e) || {};
            var eNext = e.next;
            if (eNext && eNext.eType == 'text') {
                eNext = eNext.next;
            }
            var dGender = (eNext && eNext.gender) ? eNext.gender : null;

            if (eXrefDef) {
                var defRefs = eXrefDef.ref.split(',');
                defRefs.forEach(function(i){
                    var def = defs[i] || dDef;

                    translations.push({
                        lang: lang,
                        word: word,
                        gender: pos.gender || null,
                        pos: e.pos || pos.pos || null,
                        tlang: e.lang,
                        tword: e.text,
                        tgender: e.gender || dGender,
                        def: def
                    });
                });
            } else {
                translations.push({
                    lang: lang,
                    word: word,
                    gender: pos.gender || null,
                    pos: e.pos || pos.pos || null,
                    tlang: e.lang,
                    tword: e.text,
                    tgender: e.gender || dGender,
                    def: null
                });
            }
        });

        return translations;
    }



    exports.lang = lang;
    exports.templateProcessingFunctions = templateProcessingFunctions;

    exports.extractTranslations = extractTranslations;

    exports.postProcessStructure = function (root) {
        var sections = wDom.find(root, {eType: 'section', pos: {$eq: null}});

        var posNames = {
            'Noun':      {pos: 'noun'},
            'Adjective': {pos: 'adjective'},
            'Adverb':    {pos: 'adverb'}
        };

        sections.forEach(function (e, i, a) {
            var n;
            if ((n = posNames[e.name]) !== undefined) {
                e.pos = n.pos;
            }
        });
    };

}(exports, require));
