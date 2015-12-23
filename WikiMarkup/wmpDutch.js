/**
 * Created by jason on 12/31/13.
 */

// Wiktionary Dutch Templates.
//

(function (exports, require) {
    "use strict";

    var lang = 'nl';

    var langmap = {
        'eng':'en',
        'nld':'nl',
        'deu':'de',
        'fra':'fr',
        'spa':'es',
        'swe':'sv'
    };

    var sectionTemplates = [
        {m: '=nld=',          d:2, n: 'nld',           t: 'Nederlands',             sType: 'page'},
        {m: '-info-',         d:5, n: 'info',          t: 'Information',            sType: 'info'},
        {m: '-pron-',         d:4, n: 'pron',          t: 'Pronunciation',          sType: 'Header'},
        {m: '-verb-',         d:4, n: 'verb',          t: 'Verb',                   sType: 'pos'},
        {m: '-noun-',         d:4, n: 'noun',          t: 'Noun',                   sType: 'pos'},
        {m: '-name-',         d:4, n: 'proper noun',   t: 'Proper Noun',            sType: 'pos'},
        {m: '-pronom-pers-',  d:4, n: 'pronoun',       t: 'Personal Pronoun',       sType: 'pos'},
        {m: '-pronom-pos-',   d:4, n: 'pronoun',       t: 'Possessive Pronoun',     sType: 'pos'},
        {m: '-pronom-indef-', d:4, n: 'pronoun',       t: 'Indefinite Pronoun',     sType: 'pos'},
        {m: '-pronom-dem-',   d:4, n: 'pronoun',       t: 'Demonstrative Pronoun',  sType: 'pos'},


        {m: '-prep-',         d:4, n: 'preposition',   t: 'Preposition',            sType: 'pos'},
        {m: '-adjc-',         d:4, n: 'adjective',     t: 'Adjective',              sType: 'pos'},
        {m: '-adverb-',       d:4, n: 'adverb',        t: 'Adverb',                 sType: 'pos'},
        {m: '-pron-adv-',     d:4, n: 'adverb',        t: 'Adverb',                 sType: 'pos'},

        {m: '-phrase-',       d:4, n: 'phrase',        t: 'Phrase',                 sType: 'pos'},
        {m: '-conj-',         d:4, n: 'conjunction',   t: 'Conjunction',            sType: 'pos'},
        {m: '-ordn-',         d:4, n: 'ordinal',       t: 'Ordinal Number',         sType: 'pos'},
        {m: '-num-',          d:4, n: 'number',        t: 'Number',                 sType: 'pos'},



        {m: '-note-',         d:5, n: 'note',          t: 'Note',                   sType: 'info'},
        {m: '-rel-',          d:5, n: 'rel',           t: 'Related Terms',          sType: 'rel'},
        {m: '-trans-',        d:5, n: 'trans',         t: 'Translations',           sType: 'trans'},
        {m: '-prov-',         d:5, n: 'idiom',         t: 'Idioms',                 sType: 'rel'},
        {m: '-syn-',          d:5, n: 'syn',           t: 'Synonyms',               sType: 'rel'},
        {m: '-ant-',          d:5, n: 'ant',           t: 'Antonyms',               sType: 'rel'},
        {m: '-expr-',         d:5, n: 'expr',          t: 'Expressions',            sType: 'rel'},
        {m: '-syll-',         d:5, n: 'syll',          t: 'Syllables',              sType: 'rel'},
        {m: '-etym-',         d:5, n: 'etym',          t: 'Entomology',             sType: 'rel'},
        {m: '-hypo-',         d:5, n: 'hypo',          t: 'Hyponym',                sType: 'rel'},
        {m: '-hyper-',        d:5, n: 'hyper',         t: 'Hypernym',               sType: 'rel'},
        {m: '-drv-',          d:5, n: 'drv',           t: 'Derivative',             sType: 'rel'}
    ];

    var posTemplates = [
        {m: '-nlnoun-', pos: 'noun',        t: "zelfstandig naamwoord"},
        {m: '-nlstam-', pos: 'verb',        t: "werkwoord"},
        {m: '-nlpronom-pos-', pos: 'pronoun', t: "voornaamwoord"},
        {m: '-pron-adv-tab-', pos: 'adverb',  t: "voornaamwoordelijk bijwoord"},

        {m: 'nl-adjc-form', pos: 'adjective', t: "bijvoeglijk naamwoord vorm"},
        //{m: 'ordn-nld', pos: 'ordinal', t: "Rangtelwoord"},





        {m: 'adjcomp',  pos: 'adjective',   t: "bijvoeglijk naamwoord"},
        {m: 'adjcompp', pos: 'adjective',   t: "bijvoeglijk naamwoord"}
    ];

    var posModifierTemplates = [
        {m: 'erga',  t: "ergatief"},
        {m: 'inerg', t: "inergatief"},
        {m: 'auxl',  t: "hulpwerkwoord"},
        {m: 'separ', t: "scheidbaar"},
        {m: 'ov',    t: "overgankelijk"},
        {m: 'nv.acc',t: "accusatief"},
        {m: 'nv.dat',t: "datief"}

    ];

    var attributeTokens = [
        {m: 'heraldiek',    first: true,  all: true, link: false},
        {m: 'kleur',        first: true,  all: true, link: false},
        {m: 'medisch',      first: true,  all: true, link: false},
        {m: 'grammatica',   first: true,  all: true, link: false},
        {m: 'natuurkunde',  first: true,  all: true, link: false},
        {m: 'wiskunde',     first: true,  all: true, link: false},
        {m: 'formeel',      first: true,  all: true, link: false},
        {m: 'WikiW',        first: false, all: true, link: true}
    ];


    var Element = require('./wikimarkupelement.js');
    var wDom = require('./wikiDomHelper.js');

    var posDepth = 3;
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
        // parts of speech elements are sometimes created in front of a section.  Grab it if there is one.
        var e = state.element;
        var ePos = e.lastChild();
        if (ePos && ePos.eType !== 'pos') {
            ePos = null;
        }

        // Now create the section.
        e = state.createSection(section.d, section.t, section.n, section.sType);
        e.appendChild(ePos);
        if (section.sType == 'pos') {
            e.pos = section.n;
        }
    }

    function processPartOfSpeech(token, state, match) {
        var forms = token.plist;
        var e = state.createElement('pos');
        e.name = match.t;
        e.pos = match.pos;
        e.forms = forms;
        e.lang = state.lang;
        e.text = '';

        if (forms) {
            forms = forms.filter(function(a) { return (a + ' ').trim() !== '';});
            forms = wDom.genLinks(forms);
            forms = ('('+forms.join(', ')+')').replace(/(, )+/g, ', ');
            e.text = forms;
        }
    }

    function findRelatedDefinition(e) {
        var p = wDom.findAncestor(e, {sType:'pos'});
        var li = wDom.findOne(p, {eType:'li'});
        if (li) {
            return wDom.extractText(li);
        }

        return '';
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
    templateProcessingFunctions.push(composeGroupTemplates(posTemplates, processPartOfSpeech));
    templateProcessingFunctions.push(composeGroupTemplates(posModifierTemplates, function(token, state, match){
        state.appendText('([['+match.t+']])');
    }));

    templateProcessingFunctions.push({
        m:  /^(trad|t)(\+|\-|ø)?$/,
        fn: function (token, state) {
            var plist = token.plist;
            var tlang = plist[0];
            var text = plist[1];
            var e = state.element.create('tr');
            var g = plist[2];
            e.lang = langmap[tlang] || tlang;
            e.text = text;
            e.gender = g || null;
            var tranNode = wDom.findAncestor(e, {eType: 'tran'});
            e.def = tranNode ? tranNode.text : null;
            var posNode = wDom.findAncestor(e, {eType: 'section', pos: {$exists: true}});
            e.pos = posNode ? posNode.pos : null;
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

            if (tranBlock.text.match(/\{\{.*\}\}/)) {
                var wikiMarkupParser = require('./wikimarkupparser.js');
                var subTree = wikiMarkupParser.parseEmbedded(tranBlock.text, lang, state.title);
                tranBlock.text = wDom.extractText(subTree);
            }

            // fix up the definition if necessary
            if (tranBlock.text === '') {
                tranBlock.text = findRelatedDefinition(tranBlock);
            }
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

    // Example sentence
    // Need to associate it with the right element
    templateProcessingFunctions.push({
        m:  /^bijv\-[0-9]*/,
        fn: function (token, state) {
            var c = state.element;

            // @todo: nest examples inside an example list

            c = c.lastChild() || c;
            if (c.eType == 'list') {
                c = c.lastChild();
            }
            if (c.eType == 'li' || c.eType == 'definition') {
                c = c.create('examplelist');
            } else {
                c = state.element.create('examplelist');
            }

            var e = c.create('example');
            var plist = token.plist;
            e.text = plist.join(', ');
            e.lang = state.lang;
        }
    });

    // part of speech gender
    templateProcessingFunctions.push({
        m:  /^(m|f|n|c|p)$/,
        fn: function(token, state) {
            var e = state.createElement('gender');
            e.text = '(' + token.value + ')';
            e.gender = token.value;

            var g = wDom.findPrevSibling(e, {eType:'tr'}, 2);
            if (g) {
                g.gender = e.gender;
                // remove the element
                e.detach();
            }
        }
    });

    // Handle attributes
    templateProcessingFunctions.push(composeGroupTemplates(attributeTokens, function(token, state, match){

        var attribList = [];

        if (match.first) {
            attribList.push(token.name);
        }

        if (match.all) {
            var plist = token.plist;
            plist.forEach(function(v){
                attribList.push(v);
            });
        }

        if (match.link) {
            attribList = wDom.genLinks(attribList);
        }

        var e = state.createElement('text');
        e.text = '('+attribList.join(', ')+')';
        e.name = 'attrib';
        e.value = token.name;
    }));

    // attributes
    templateProcessingFunctions.push({
        m:  /^(heraldiek|kleur|medisch|grammatica|natuurkunde|wiskunde|formeel)$/,
        fn: singleAttribute
    });

    // expression/idiom
    templateProcessingFunctions.push({
        m:  /^(expr)$/,
        fn: function (token, state) {
            var e = state.element.create('idiom');
            var plist = token.plist;
            e.text = plist[0];
            e.def = plist[1] || '';
        }
    });

    // Skip top level languages
    templateProcessingFunctions.push({m:/\=[a-zA-Z0-9]+=/, fn: function (token, state) {
        state.stopFurtherProcessing();
    }});

    var tokensToSkip = [
        'niet-GB',  // Not in the Green Book
        'wnt-r',    // Link to http://gtb.inl.nl/iWDB/search?actie=article_content&wdb=WNT&id=M036347
        '((', '))', // This is a grouping template set, skip for now.
        '='         // Horizontal break, skip for now.
    ];

    templateProcessingFunctions.push(composeListTemplate(tokensToSkip, skipToken));

    // Skip top level languages
    templateProcessingFunctions.push({m:/\=[a-zA-Z0-9]+=/, fn: function (token, state) {
        var name = token.name.replace(/\=([a-zA-Z0-9]+)=/, '$1');
        state.createSection(2, name, name, 'page');
    }});


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

            if (!e.def) {
                // it is possible our tran-top didn't have a definition
                e.def = findRelatedDefinition(e);
            }

            translations.push({
                lang: lang,
                word: word,
                gender: null,
                pos: e.pos || null,
                tlang: e.lang,
                tword: e.text.trim(),
                tgender: e.gender || null,
                def: e.def || null
            });
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
