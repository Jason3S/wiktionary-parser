/**
 * Created by jason on 1/22/14.
 */

(function (exports, require) {
    "use strict";

    var lang = 'fr';

    var langmap = {
        'eng':'en',
        'nld':'nl',
        'deu':'de',
        'fra':'fr',
        'spa':'es',
        'swe':'sv'
    };

    var sectionTemplates = [
        {m: '=fr=',           d:2, n: 'fr',            t: 'French',                 sType: 'page'},
        {m: '-info-',         d:5, n: 'info',          t: 'Information',            sType: 'info'},
        {m: '-pron-',         d:4, n: 'pron',          t: 'Pronunciation',          sType: 'Header'},
        {m: 'prononciation',  d:4, n: 'pron',          t: 'Pronunciation',          sType: 'Header'},

        {m: '-verb-',         d:4, n: 'verb',          t: 'Verb',                   sType: 'pos'},
        {m: '-nom-',          d:4, n: 'noun',          t: 'Noun',                   sType: 'pos'},
        {m: '-loc-nom-',      d:4, n: 'noun',          t: 'Noun',                   sType: 'pos'},

        {m: 'verbe',          d:4, n: 'verb',          t: 'Verb',                   sType: 'pos'},
        {m: 'nom',            d:4, n: 'noun',          t: 'Noun',                   sType: 'pos'},

        {m: '-name-',         d:4, n: 'proper noun',   t: 'Proper Noun',            sType: 'pos'},
        {m: '-pronom-pers-',  d:4, n: 'pronoun',       t: 'Personal Pronoun',       sType: 'pos'},
        {m: '-pronom-pos-',   d:4, n: 'pronoun',       t: 'Possessive Pronoun',     sType: 'pos'},
        {m: '-pronom-indef-', d:4, n: 'pronoun',       t: 'Indefinite Pronoun',     sType: 'pos'},
        {m: '-pronom-dem-',   d:4, n: 'pronoun',       t: 'Demonstrative Pronoun',  sType: 'pos'},

        {m: '-adj-',          d:4, n: 'adjective',     t: 'Adjective',              sType: 'pos'},
        {m: '-loc-adj-',      d:4, n: 'adjective',     t: 'Adjective',              sType: 'pos'},
        {m: 'adjectif',       d:4, n: 'adjective',     t: 'Adjective',              sType: 'pos'},

        {m: '-adverb-',       d:4, n: 'adverb',        t: 'Adverb',                 sType: 'pos'},
        {m: '-loc-adv-',      d:4, n: 'adverb',        t: 'Adverb',                 sType: 'pos'},
        {m: '-loc-conj-',     d:4, n: 'conj',          t: 'Conjunctive',            sType: 'pos'},
        {m: '-loc-interj-',   d:4, n: 'interj',        t: 'Interjection',           sType: 'pos'},
        {m: '-loc-phr-',      d:4, n: 'phrase',        t: 'Phrase',                 sType: 'pos'},
        {m: '-loc-post-',     d:4, n: 'postpositive',  t: 'Postpositive',           sType: 'pos'},
        {m: '-loc-prép-',     d:4, n: 'preposition',   t: 'Preposition',            sType: 'pos'},
        {m: '-loc-pronom-',   d:4, n: 'pronoun',       t: 'Pronoun',                sType: 'pos'},
        {m: '-loc-verb-',     d:4, n: 'verb',          t: 'Verb',                   sType: 'pos'},

        {m: '-prep-',         d:4, n: 'preposition',   t: 'Preposition',            sType: 'pos'},
        {m: '-pron-adv-',     d:4, n: 'adverb',        t: 'Adverb',                 sType: 'pos'},

        {m: '-phrase-',       d:4, n: 'phrase',        t: 'Phrase',                 sType: 'pos'},
        {m: '-conj-',         d:4, n: 'conjunction',   t: 'Conjunction',            sType: 'pos'},
        {m: '-ordn-',         d:4, n: 'ordinal',       t: 'Ordinal Number',         sType: 'pos'},
        {m: '-num-',          d:4, n: 'number',        t: 'Number',                 sType: 'pos'},



        {m: '-note-',         d:5, n: 'note',          t: 'Note',                   sType: 'info'},
        {m: '-rel-',          d:5, n: 'rel',           t: 'Related Terms',          sType: 'rel'},
        {m: '-trad-',         d:5, n: 'trans',         t: 'Translations',           sType: 'trans'},
        {m: 'trad-trier',     d:5, n: 'trans',         t: 'Translations',           sType: 'trans'},
        {m: 'traductions',    d:5, n: 'trans',         t: 'Translations',           sType: 'trans'},
        {m: 'traductions à trier', d:5, n: 'trans',    t: 'Traductions à trier',    sType: 'trans'},
        {m: '-réf-',          d:5, n: 'ref',           t: 'Reference',              sType: 'rel'},
        {m: 'références',     d:5, n: 'ref',           t: 'Reference',              sType: 'rel'},

        {m: '-prov-',         d:5, n: 'idiom',         t: 'Idioms',                 sType: 'rel'},
        {m: '-syn-',          d:5, n: 'syn',           t: 'Synonyms',               sType: 'rel'},
        {m: 'synonymes',      d:5, n: 'syn',           t: 'Synonyms',               sType: 'rel'},
        {m: 'antonymes',      d:5, n: 'ant',           t: 'Antonyms',               sType: 'rel'},
        {m: 'dérivés',        d:5, n: 'derive',        t: 'Dérivés',                sType: 'rel'},
        {m: '-apr-',          d:5, n: 'ant',           t: 'Antonyms',               sType: 'rel'},
        {m: '-exp-',          d:5, n: 'expr',          t: 'Expressions',            sType: 'rel'},
        {m: '-syll-',         d:5, n: 'syll',          t: 'Syllables',              sType: 'rel'},
        {m: '-étym-',         d:5, n: 'etym',          t: 'Entomology',             sType: 'rel'},
        {m: 'étymologie',     d:5, n: 'etym',          t: 'Entomology',             sType: 'rel'},
        {m: '-hypo-',         d:5, n: 'hypo',          t: 'Hyponym',                sType: 'rel'},
        {m: 'hyponymes',      d:5, n: 'hypo',          t: 'Hyponym',                sType: 'rel'},
        {m: '-hyper-',        d:5, n: 'hyper',         t: 'Hypernym',               sType: 'rel'},
        {m: 'hyperonymes',    d:5, n: 'hyper',         t: 'Hypernym',               sType: 'rel'},

        {m: '-voir-',         d:5, n: 'see',           t: 'See Also',               sType: 'rel'},

        {m: '-drv-',          d:5, n: 'drv',           t: 'Derivative',             sType: 'rel'}
    ];

    var posTemplates = [

        {m: 'fr-verbe-flexion', pos: 'verb', t: 'verbe flexion'},
        {m: 'fr-accord-cons',   pos: 'noun', t: 'nom'},
        {m: 'conjugaison',      pos: 'conj', t: 'conjugation'},
        {m: 'conj',             pos: 'conj', t: 'conjugation'},

        {m: 'adjcomp',  pos: 'adjective',   t: "bijvoeglijk naamwoord"},
        {m: 'adjcompp', pos: 'adjective',   t: "bijvoeglijk naamwoord"}
    ];

    var posModifierTemplates = [
        {m: 't',     t: 'transitive'},
        {m: 'impr',  t: 'imperative'},
        {m: 'prnl',  t: 'reflexive'}

    ];

    var attributeTokens = [
        {m: 'histoire',     first: true,  all: false, link: false},
        {m: 'familier',     first: true,  all: true,  link: false},
        {m: 'grammaire',    first: true,  all: true,  link: false},
        {m: 'architecture', first: true,  all: false, link: false},
        {m: 'figuré',       first: true,  all: false, link: false},
        {m: 'religion',     first: true,  all: false, link: false},
        {m: 'astrologie',   first: true,  all: false, link: false},
        {m: 'argot',        first: true,  all: false, link: false},
        {m: 'urban',        first: true,  all: false, link: false},
        {m: 'term',         first: true,  all: true,  link: false},
        {m: 'auxiliaire',   first: true,  all: false, link: false},
        {m: 'impersonnel',  first: true,  all: false, link: false},
        {m: 'musique',      first: true,  all: false, link: false},
        {m: 'mathématiques',first: true,  all: false, link: false},
        {m: 'vulgaire',     first: true,  all: false, link: false},  // Might want to flag this one.
        {m: 'au pluriel',   first: true,  all: false, link: false},
        {m: 'vieilli',      first: true,  all: false, link: false},
        {m: 'justice',      first: true,  all: false, link: false},
        {m: 'Canada',       first: true,  all: false, link: false},
        {m: 'christianisme',first: true,  all: false, link: false},
        {m: 'botanique',    first: true,  all: false, link: false},
        {m: 'cuisine',      first: true,  all: false, link: false},
        {m: 'couleur',      first: true,  all: false, link: false},   // This is really a color table.
        {m: 'manège',       first: true,  all: false, link: false},
        {m: 'logique',      first: true,  all: false, link: false},


        {m: 'sport',        first: true,  all: false, link: false},
        {m: 'WikiW',        first: false, all: true,  link: true}
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

    function buildGroupMap(group) {
        var map = {};
        var i = 0;
        for (i = 0; i < group.length; ++i) {
            var s = group[i];
            map['@'+s.m] = s;
        }

        map.test = function(v) {
            return map['@'+v] ? true : false;
        };

        map.get = function(v) {
            return map['@'+v];
        };

        return map;
    }

    function composeGroupTemplates(group, fnProcessTemplate) {
        var map = buildGroupMap(group);

        return {
            m: { test: map.test },
            fn: function(token, state) { fnProcessTemplate(token, state, map.get(token.name));}
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

    function composeProcessSectionTemplate() {
        var map = buildGroupMap(sectionTemplates);

        var processSectionTemplate = function(token, state) {
            var plist = token.plist;
            var sectionName = plist[0];
            var section = {m: '', d:token.name.length-1, n: sectionName, t: '{'+sectionName+'}' , sType: 'section'};

            if (map.test(sectionName)) {
                var s = map.get(sectionName);
                section.n = s.n;
                section.t = s.t;
                section.sType = s.sType;
            }

            processSection(token, state, section);
        };

        return {m: /^S=+$/, fn: processSectionTemplate};
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

    templateProcessingFunctions.push(composeProcessSectionTemplate());
    templateProcessingFunctions.push(composeGroupTemplates(sectionTemplates, processSection));
    templateProcessingFunctions.push(composeGroupTemplates(posTemplates, processPartOfSpeech));
    templateProcessingFunctions.push(composeGroupTemplates(posModifierTemplates, function(token, state, match){
        state.appendText('([['+match.t+']])');
    }));

    // Language Sections
    templateProcessingFunctions.push({
        m:  /^langue$/,
        fn: function (token, state) {
            var plist = token.plist;
            if (plist[0] == 'fr') {
                state.createSection(2, 'French', plist[0], 'page');
                return;
            }
            state.createSection(2, plist[0], plist[0], 'page');

        }
    });

    templateProcessingFunctions.push({
        m:  /^(trad)(\+|\-|ø)*$/,
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
        m:  /^trad\-début$/,
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
        }
    });

    templateProcessingFunctions.push({
        m:  /^trad\-fin$/,
        fn: function (token, state) {
            if (state.element.eType == 'tran') {
                state.element = state.element.parent;
            }
            state.skipToken('LF');
        }
    });

    templateProcessingFunctions.push({
        m:  /^trand\-mid[0-9]*$/,
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

            // should nest examples inside an example list

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
        m:  /^(m|f|n|c|p|mf)$/,
        fn: function(token, state) {
            var mapEquiv = {'m': 'feminine', 'f': 'masculine'};
            var e = state.createElement('gender');
            var g = token.argv[0];
            var t = token.argv[0];
            var kvp = token.kvp;
            var extras = [];
            var append = '';
            var k;

            if (mapEquiv[g]) {
                for (k in kvp) {
                    if (kvp.hasOwnProperty(k)) {
                        extras.push(kvp[k]);
                    }
                }

                if (extras.length) {
                    append = ' - ' + mapEquiv[g] + ': ' + extras.join(', ');
                }
            }

            e.text = '(' + t + append + ')';
            e.gender = token.argv[0];

            var tr = wDom.findPrevSibling(e, {eType:'tr'}, 2);
            if (tr) {
                tr.gender = e.gender;
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
        'fr-rég',  //
        'pron',    // Link to http://gtb.inl.nl/iWDB/search?actie=article_content&wdb=WNT&id=M036347
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
        var sections = wDom.find(root, {eType: 'section', sType: 'page', name: {$ne:'fr'}});

        sections.forEach(function(e){
            e.detach();
        });
    };



}(exports, require));
