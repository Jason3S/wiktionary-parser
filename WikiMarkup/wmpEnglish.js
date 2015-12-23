// wmpEnglish.js

// Wiktionary English Templates.
//

(function (exports, require) {
    "use strict";

    var Element = require('./wikimarkupelement.js');
    var wDom = require('./wikiDomHelper.js');

    var posDepth = 6;
    var lang = 'en';
    var templateProcessingFunctions = [];

    function genPlist(argv) {
        var reMatchHeader = /\=/;
        var plist = argv.filter(function (v) {
            return !reMatchHeader.test(v);
        });

        return plist.slice(1);
    }

    function skipToken(state, tokenName) {
        state.skipToken(tokenName);
    }

    function tEnglishNouns(token, state) {
        // See: http://en.wiktionary.org/wiki/Template:en-noun
        // The template includes plural versions of the noun

        var suffixSet = {'s': 1, 'es': 1, 'ies': 1, 'a': 1, 'i': 1};
        var word = state.title;
        var root = word;
        var plurals = [];
        var forms = [];
        var suffix = 's';

        var pset = token.kvp;
        var params = token.argv;
        var plist = genPlist(params);
        var i;

        if (pset.head) {
            word = pset.head;
            root = word.replace(/(\[\[|\]\])/g, '');
        }

        if (plist.length) {

            if ((/-/).test(plist.join(''))) {
                // uncountable
                if (plist[0] == '-') {
                    if (plist.length == 1) {
                        forms.push("''uncountable''");
                        suffix = '';
                    }
                    else {
                        forms.push("''usually uncountable''");
                        suffix = plist[1];
                    }
                } else {
                    if (plist.length == 2) {
                        suffix = plist[0];
                    }
                    else {
                        root = plist[0];
                        suffix = plist[1];
                    }
                }
            } else if ((/~/).test(plist.join(''))) {
                forms.push("''countable and uncountable''");
                if (plist.length == 2) {
                    suffix = plist[1];
                }
                else if (plist.length > 2) {
                    root = plist[1];
                    suffix = plist[2];
                }
            }
            else {
                if (plist.length == 1) {
                    suffix = plist[0];
                }
                else {
                    root = plist[0];
                    suffix = plist[1];
                }
            }

            if (suffix) {
                if (suffixSet[suffix]) {
                    // Yes, known plural suffix
                    plurals.push(wDom.genBoldLink(root + suffix));
                }
                else {
                    // Unknown, assume fully qualified plural
                    plurals.push(wDom.genBoldLink(suffix));
                }
            }

            // Clear the plurals if they are in question.
            if ((/\?|!/).test(plist.join(''))) {
                plurals = [];
            }
        }
        else {
            plurals.push(wDom.genBoldLink(root + suffix));
        }

        if (pset.pl) {
            plurals[0] = wDom.genBoldLink(pset.pl);
        }

        for (i = 2; pset['pl' + i]; ++i) {
            plurals[i - 1] = wDom.genBoldLink(pset['pl' + i]);
        }

        if (plurals.length) {
            forms.push("''plural'' " + plurals.join(" ''or'' "));
        }

        var tt = wDom.makeBold(word);
        if (forms.length) {
            tt += " (" + forms.join('; ') + ")";
        }

        var properties = {name: 'noun', forms: [], text: tt, lang: lang};

        return properties;
    }


    function tEnglishVerbs(token, state) {
        // See: http://en.wiktionary.org/wiki/Template:en-verb
        var word = state.title;

        var pset = token.kvp;
        var params = token.argv;
        var plist = genPlist(params);

        function getPresent3rdPersonSing() {
            /*
             <!--
             // If the 2nd/3rd parameter is "es", return "{1}[{2}]es".
             -->{{#ifeq:{{#if:{{{3|}}}|{{{3}}}|{{{2}}}}}|es|{{{1}}}{{#if:{{{3|}}}|{{{2}}}}}es|<!--
             // Else if the 2nd+3rd parameter is "ied", return "{1}{2}es".
             -->{{#ifeq:{{{2}}}{{{3}}}|ied|{{{1}}}{{{2}}}es|<!--
             // Else if the 2nd/3rd parameter is "d", "ed", or "ing", return "{PAGENAME}s".
             -->{{#switch: {{#if:{{{3|}}}|{{{3}}}|{{{2}}}}}|d|ed|ing={{PAGENAME}}s|<!--
             // Else if there are 3 or more parameters, return {1}
             -->{{#if:{{{3|}}}|{{{1}}}|<!--
             // Else return {PAGENAME}s
             -->{{PAGENAME}}s<!--
             -->}}}}}}}}
             */

            var ending = plist[2] || plist[1];
            if (ending) {
                if (ending == 'es') {
                    return plist.join('');
                }
                if (ending == 'ied') {
                    return plist.slice(0, -1).join('') + 'es';
                }
                if (({'d': 1, 'ed': 1, 'ing': 1}).hasOwnProperty(ending)) {
                    return word + 's';
                }
                if (plist.length >= 3) {
                    return plist[0];
                }
            }

            return word + 's';
        }

        function getPresP() {
            /*
             <!--
             // If the 2nd/3rd parameter is "es", return "{1}[{2}]ing".
             -->{{#ifeq:{{#if:{{{3|}}}|{{{3}}}|{{{2}}}}}|es|{{{1}}}{{#if:{{{3|}}}|{{{2}}}}}ing|<!--
             // Else if the 2nd+3rd parameter is "ied", return "{PAGENAME}ing".
             -->{{#ifeq:{{{2}}}{{{3}}}|ied|{{PAGENAME}}ing|<!--
             // Else if the 2nd/3rd parameter is "d", "ed", or "ing", return "{1}[{2}]ing".
             -->{{#switch: {{#if:{{{3|}}}|{{{3}}}|{{{2}}}}}|d|ed|ing={{{1}}}{{#if:{{{3|}}}|{{{2}}}}}ing|<!--
             // Else if there are 3 or more parameters, return {2}, else return {PAGENAME}ing
             -->{{#if:{{{3|}}}|{{{2}}}|{{PAGENAME}}ing}}<!--
             -->}}}}}}
             */

            var ending = plist[2] || plist[1];
            if (ending) {
                if (ending == 'es') {
                    return plist.slice(0, -1).join('') + 'ing';
                }
                if (ending == 'ied') {
                    return word + 'ing';
                }
                if (({'d': 1, 'ed': 1, 'ing': 1}).hasOwnProperty(ending)) {
                    return plist.slice(0, -1).join('') + 'ing';
                }
                if (plist.length >= 3) {
                    return plist[1];
                }
            }

            return word + 'ing';
        }

        function getPast() {
            /*
             <!--
             // If the 2nd/3rd parameter is "d" or "ed", return "{1}{2}[{3}]".
             -->{{#switch:{{#if:{{{3|}}}|{{{3}}}|{{{2}}}}}|d|ed={{{1}}}{{{2}}}{{{3|}}}|<!--
             // Else if the 2nd/3rd parameter is "es", return "{1}[{2}]ed".
             -->{{#ifeq:{{#if:{{{3|}}}|{{{3}}}|{{{2}}}}}|es|{{{1}}}{{#if:{{{3|}}}|{{{2}}}}}ed|<!--
             // Else if the 2nd+3rd parameter are "ying", return "{PAGENAME}d".
             -->{{#ifeq:{{{2}}}{{{3}}}|ying|{{PAGENAME}}d|<!--
             // Else if the 2nd/3rd parameter is "ing", return "{1}[{2}]ed".
             -->{{#ifeq:{{#if:{{{3|}}}|{{{3}}}|{{{2}}}}}|ing|{{{1}}}{{#if:{{{3|}}}|{{{2}}}}}ed|<!--
             // Else if there are 3 or more parameters, return {3}
             -->{{#if:{{{3|}}}|{{{3}}}|{{PAGENAME}}ed}}<!--
             -->}}}}}}}}
             */
            var ending = plist[2] || plist[1];
            if (ending) {
                if (({'d': 1, 'ed': 1}).hasOwnProperty(ending)) {
                    return plist.join('');
                }
                if (ending == 'es') {
                    return plist.slice(0, -1).join('') + 'ed';
                }
                if (plist[1] + (plist[2] || '') == 'ying') {
                    return word + 'd';
                }
                if (ending == 'ing') {
                    return plist.slice(0, -1).join('') + 'ed';
                }
                if (plist.length >= 3 && plist[2]) {
                    return plist[2];
                }
            }

            return word + 'ed';
        }

        function getPastP() {
            /*
             <!--
             // If the 2nd/3rd parameter is "d" or "ed", use them.
             -->{{#switch:{{#if:{{{3|}}}|{{{3}}}|{{{2}}}}}|d|ed={{{1}}}{{{2}}}{{{3|}}}|<!--
             // Else if the 2nd/3rd parameter is "es", return "{1}[{2}]ed".
             -->{{#ifeq:{{#if:{{{3|}}}|{{{3}}}|{{{2}}}}}|es|{{{1}}}{{#if:{{{3|}}}|{{{2}}}}}ed|<!--
             // Else if the 2nd+3rd parameter are "ying", return "{PAGENAME}d".
             -->{{#ifeq:{{{2}}}{{{3}}}|ying|{{PAGENAME}}d|<!--
             // Else if the 2nd/3rd parameter is "ing", return "{1}[{2}]ed".
             -->{{#ifeq:{{#if:{{{3|}}}|{{{3}}}|{{{2}}}}}|ing|{{{1}}}{{#if:{{{3|}}}|{{{2}}}}}ed|<!--
             // Else if there are 3 or more parameters, return {4}/{3}
             -->{{#if:{{{3|}}}|{{#if:{{{4|}}}|{{{4}}}|{{{3}}}}}|<!--
             // Else just add "ed"
             -->{{PAGENAME}}ed<!--
             -->}}}}}}}}}}
             */
            var ending = plist[2] || plist[1];
            if (ending) {
                if (({'d': 1, 'ed': 1}).hasOwnProperty(ending)) {
                    return plist.join('');
                }
                if (ending == 'es') {
                    return plist.slice(0, -1).join('') + 'ed';
                }
                if (plist[1] + (plist[2] || '') == 'ying') {
                    return word + 'd';
                }
                if (ending == 'ing') {
                    return plist.slice(0, -1).join('') + 'ed';
                }
                if (plist.length >= 3 && plist[2]) {
                    return plist[3] || plist[2];
                }
            }

            return word + 'ed';

        }

        var forms = [
            getPresent3rdPersonSing(),
            getPresP(),
            getPast(),
            getPastP()
        ];
        var i;

        for (i = 0; i < forms.length; ++i) {
            if (forms[i] != '-') {
                forms[i] = wDom.genBoldLink(forms[i]);
            }
        }

        if (pset.head && pset.head != '-') {
            word = pset.head;
        }

        var tt = wDom.makeBold(word);
        if (forms.length) {
            tt += " (" + forms.join(', ') + ")";
        }

        var properties = {name: 'verb', forms: [], text: tt, lang: lang};

        return properties;
    }

    function tEnglishAdj(token, state) {
        // See: http://en.wiktionary.org/wiki/Template:en-adj
        var word = state.title;
        var root = word;
        var special = {'er': 1, 'more': 2};

        function getCompareState(plist) {
            if (plist[0] == '-') {
                if (plist.length > 1) {
                    return 1;
                }
                return 0;
            }

            return 2;
        }


        function getComparativeSuperlativeForms(plist, word, form, suffix) {
            if (!plist.length) {
                return wDom.makeBold(form) + ' ' + wDom.makeBold(word);
            }

            var i = (plist[0] == '-') ? 1 : 0;
            if (i < plist.length) {
                if (plist[i] != 'er' && plist[i] != 'more') {
                    word = plist[i];
                    ++i;
                    if (i == plist.length || (plist[i] != 'er' && plist[i] != 'more')) {
                        return wDom.genBoldLink(word);
                    }
                }

                var parts = [];
                if (plist[i] == 'er') {
                    var tword = (word + suffix).replace(/yer$/, 'ier').replace(/yest$/, 'iest');
                    parts.push(wDom.genBoldLink(tword));
                    ++i;
                }

                if (plist[i] == 'more') {
                    parts.push(wDom.makeBold(form) + ' ' + wDom.makeBold(word));
                }

                return  parts.join(' or ');
            }
            return '';
        }

        function getComparative(plist, word) {
            return getComparativeSuperlativeForms(plist, word, 'more', 'er');
        }

        function getSuperlative(plist, word) {
            return getComparativeSuperlativeForms(plist, word, 'most', 'est');
        }

        var pset = token.kvp;
        var params = token.argv;
        var plist = genPlist(params);
        var compIndex = getCompareState(plist);
        var compValues = ["''not comparable''", "''not generally comparable''; ", ''];
        var forms = [];
        var tt = '';

        if (compIndex) {
            forms =
                ["''comparative'' " + getComparative(plist, word), "''superlative'' " + getSuperlative(plist, word)];
        }

        if (pset.head && pset.head != '-') {
            word = pset.head;
        }

        tt = "'''" + word + "'''";
        if (plist[0] != '?') {
            if (forms.length) {
                tt += " (" + compValues[compIndex] + forms.join(', ') + ")";
            }
            else {
                tt += " (" + compValues[compIndex] + ")";
            }
        }

        var properties = {name: 'adjective', forms: [], text: tt, lang: lang};

        return properties;
    }

    function tEnglishAdv(token, state) {
        var properties = tEnglishAdj(token, state);
        properties.name = 'adverb';

        return properties;
    }


    function tEnglishGenericPOS(token, state, name) {
        var word = state.title;
        var pos = name;

        var properties = {name: pos, forms: [], text: word, lang: lang};

        return properties;

    }


    function tHead(token, state) {
        var word = state.title;
        var pset = token.kvp;
        var params = token.argv;
        var plist = genPlist(params);
        var pos = '';

        if (pset.head) {
            word = pset.head;
        }

        // the POS is always the 2nd param after head.
        pos = plist[1] || pos;

        var tt = wDom.decorateText(word, "'''", "'''");

        var properties = {name: pos, forms: [], text: tt, lang: lang};

        return properties;

    }


    function tEnglishPartsOfSpeach(token, state) {
        // The template is followed by the definitions in a list.
        // We handle this by putting the whole thing in a block.

        var block = state.element.create('pos');

        var properties = {name: token.name, text: token.value, lang: lang};

        switch (token.name) {
            case 'en-noun':
                properties = tEnglishNouns(token, state);
                break;
            case 'en-proper noun':
                properties = tEnglishNouns(token, state);
                properties.name = 'Proper noun';
                break;
            case 'en-verb':
                properties = tEnglishVerbs(token, state);
                break;
            case 'en-adj':
                properties = tEnglishAdj(token, state);
                break;
            case 'en-adv':
                properties = tEnglishAdv(token, state);
                break;
            case 'en-particle':
                properties = tEnglishGenericPOS(token, state, 'Particle');
                break;
            case 'en-part':
                properties = tEnglishGenericPOS(token, state, 'Particle');
                break;
            case 'en-interj':
                properties = tEnglishGenericPOS(token, state, 'Interjection');
                break;
            case 'head':
                properties = tHead(token, state);
                break;
        }

        var section = wDom.findAncestor(state.element, {eType: 'section'});
        section.pos = properties.name.toLowerCase();

        block.properties = properties;
        block.name = properties.name;
        block.text = properties.text;
        block.lang = properties.lang;
    }

    function tQuote(token, state) {
        var e = state.element.create('quote');
        e.text = token.kvp.passage || 'quote:';
        e.lang = lang;
        e.value = token.value;
    }

    function tMapToText(token, state) {
        var e = state.element.create('text');
        e.text = '(' + token.name + ')';
    }


    function dropElementFromList(list, value) {
        var fn = function (e) {
            return e != value;
        };
        if (value instanceof RegExp) {
            fn = function (e) {
                return value.test(e);
            };
        }
        return list.filter(fn);
    }


    function tContext(token, state) {
        var params = token.argv;
        var name = params[0];
        if (name == 'cx') {
            name = 'context';
        }
        var text = '(' + name + ')';

        var plist = genPlist(params);
        plist = dropElementFromList(plist, '_');
        if (plist.length) {
            text = '(' + name + ': ' + plist.join(', ') + ')';
        }
        state.element.appendText(text, lang);
    }

    function genPropertyList(params) {
        params = dropElementFromList(params, '_');
        var text = '';

        if (params.length) {
            text = '(' + params.join(', ') + ')';
        }

        return text;
    }

    function tPropertyList(token, state) {
        var text = genPropertyList(token.argv);
        if (text) {
            state.element.appendText(text, lang);
        }
    }

    function tPropertyListSkipFirst(token, state) {
        var text = genPropertyList(token.argv.slice(1));
        if (text) {
            state.element.appendText(text, lang);
        }
    }

    function tLastProperty(token, state) {
        var params = token.argv;
        if (params.length) {
            var text = '(' + params[params.length - 1] + ')';
            state.element.appendText(text, lang);
        }
    }


    function tSkipEntry(token, state) {
        // This template has been deliberately skipped.
        skipToken(state, 'LF');
    }

    function ttGenFormOf(text, pos) {
        return function (token, state) {
            var reTestLink = /\[\[.+\]\]/;
            var link = token.argv[1];

            if (!reTestLink.test(link)) {
                link = '[[' + link + ']]';
            }
            state.element.appendText(text + link, lang);
            var section = wDom.findAncestor(state.element, {eType: 'section'});
            section.pos = pos;
        };
    }

    // Parts of Speech templates
    templateProcessingFunctions.push({ m: /^en-past of$/, fn: ttGenFormOf('Past tense of: ', 'past') });
    templateProcessingFunctions.push({ m: /^en-superlative of$/, fn: ttGenFormOf('Superlative of: ', 'superlative') });
    templateProcessingFunctions.push({ m: /^en-comparative of$/, fn: ttGenFormOf('Comparative of: ', 'comparative') });
    templateProcessingFunctions.push({ m: /^en-third-person singular of$/, fn: ttGenFormOf('Third-person singular of: ',
        'third-person singular') });
    templateProcessingFunctions.push({m: /^(en-.*|head)$/, fn: tEnglishPartsOfSpeach});


    templateProcessingFunctions.push({ m: /^(context|qualifier|chiefly|cx)\s*/, fn: tContext });
    // Countries
    templateProcessingFunctions.push({ m: /^(Scotland|US|North America|British|Australia|New Zealand|Canada|England|UK)\s*/, fn: tPropertyList });  // Countries
    // Sports
    templateProcessingFunctions.push({ m: /^(golf|sailing|cricket|baseball|sports|curling|surfing|skateboarding|tennis|fishing|basketball|football|hockey)\s*/, fn: tPropertyList }); // Sports
    // Games
    templateProcessingFunctions.push({ m: /^(gaming|video games|card games|game of go|poker|bridge|chess|checkers)\s*/, fn: tPropertyList }); // Games
    // Science
    templateProcessingFunctions.push({ m: /^(biochemistry|geometry|aeronautics|sciences|astrology|computer science|mathematics|math|astronomy|meteorology|typography|economics|epidemiology|sociology|psychology|statistics|anthropology|archaeology|paleontology|chemistry|medicine)\s*/, fn: tPropertyList });
    // Grammar and speech related
    templateProcessingFunctions.push({ m: /^(imperative|historical|nonstandard|idiomatic|auxiliary|archaic|obsolete|buzzword|especially|usually|informal|SIC|figuratively|archaic|uncountable|countable|dated|transitive|intransitive|reflexive|rare|slang|vulgar|offensive|plural only|in the plural|derogatory|grammar|figuratively|colloquial|typography|non-gloss definition|rhetoric)\s*/, fn: tPropertyList });
    // Others
    templateProcessingFunctions.push({ m: /^(cooking|military|computing|legal|printing|music|linguistics|arts|sports)\s*/, fn: tPropertyList });
    templateProcessingFunctions.push({ m: /^(nautical|surgery|aeronautics|sciences|business|politics|theology)\s*/, fn: tPropertyList });
    templateProcessingFunctions.push({ m: /^(computer science|group theory|telegraphy|programming|logic|Internet|art|painting and sculpture)\s*/, fn: tPropertyList });
    templateProcessingFunctions.push({ m: /^(math|by extension|industry|surfing|skateboarding|UK|tennis|fishing|fantasy|astronomy|meteorology)\s*/, fn: tPropertyList });
    templateProcessingFunctions.push({ m: /^(qualifier|colloquial|typography|non-gloss definition|rhetoric|heraldry|economics|databases|set theory|anatomy)\s*/, fn: tPropertyList });
    templateProcessingFunctions.push({ m: /^(graph theory|optics|epidemiology|sociology|psychology|marketing|retailing|statistics|anthropology)\s*/, fn: tPropertyList });
    templateProcessingFunctions.push({ m: /^(archaeology|paleontology|Multicultural|poker|chemistry|category theory|medicine|schools)\s*/, fn: tPropertyList });
    templateProcessingFunctions.push({ m: /^quote-(book|magazine|news|journal)/, fn: tQuote });
    templateProcessingFunctions.push({ m: /^(senseid)\s*/, fn: tLastProperty });
    templateProcessingFunctions.push({ m: /^(rfquotek|label)\s*/, fn: tPropertyListSkipFirst });

    templateProcessingFunctions.push({
        m:  /^(past participle of|plural of|alternative spelling of|third-person singular of|present participle of|irregular plural of|alternative form of|acronym of|also|past of|comparative of|superlative of|misspelling of|inflected form of|alternative spelling of)\s*$/,
        fn: function (token, state) {
            var text = token.argv[0] + ': ';
            var reTestLink = /\[\[.+\]\]/;
            var links = [];
            var i, link;
            var words = token.argv.slice(1);
            var reg = /^(lang\=|nocat\=)/;  //
            for (i = 0; i < words.length; ++i) {
                link = words[i];
                if (reg.test(link)) {
                    continue;
                }

                if (!reTestLink.test(link)) {
                    link = '[[' + link + ']]';
                }

                links.push(link);
            }
            state.element.appendText(text + links.join(', '), lang);
        }
    });

    templateProcessingFunctions.push({
        m:  /^term$/,
        fn: function (token, state) {
            var text = token.argv[1] || token.argv[2] || token.value;
            state.element.appendText(text, lang);
        }
    });

    templateProcessingFunctions.push({
        // Gender
        m:  /^(m|f|n|mf)$/,
        fn: function (token, state) {
            var text = '(' + token.argv[0] + ')';
            state.element.appendText(text, lang);
        }
    });

    templateProcessingFunctions.push({
        m:  /^(l\/en|w)$/,
        fn: function (token, state) {
            var text = token.argv[1] || token.value;
            state.element.appendText(text, lang);
        }
    });

    templateProcessingFunctions.push({
        // Link
        m:  /^(l)$/,
        fn: function (token, state) {
            var text = wDom.decorateText(token.argv[2], "[[", "]]");
            var linkLang = token.argv[1] || lang;
            state.element.appendText(text, linkLang);
        }
    });

    templateProcessingFunctions.push({
        m:  /^usex$/,
        fn: function (token, state) {
            var params = token.argv;
            var plist = genPlist(params);
            var text = 'Usage: ' + (plist.join('; '));
            state.element.appendText(text, lang);
        }
    });

    templateProcessingFunctions.push({
        m:  /^(sense|defdate)\s*$/,
        fn: function (token, state) {
            var text = '(' + (token.argv[1] || token.value) + ')';
            state.element.appendText(text, lang);
        }
    });

    templateProcessingFunctions.push({
        m:  /^RQ:/,
        fn: function (token, state) {
            var text = token.argv.join(', ');
            text = '(' + text.replace('RQ:', '') + ')';
            state.element.appendText(text, lang);
        }
    });

    templateProcessingFunctions.push({
        m:  /^&lit/,
        fn: function (token, state) {
            var plist = token.plist;
            var text = "''Used other than as an idiom: see'' " + wDom.decorateTextItems(plist, "[[", "]]").join(', ');
            state.element.appendText(text, lang);
        }
    });

    templateProcessingFunctions.push({
        m:  /^soplink/,
        fn: function (token, state) {
            var text = token.argv.slice(1).join(' ').replace(/\s*\{\{=\}\}\s*/g, '');
            state.element.appendText(text, lang);
        }
    });

    templateProcessingFunctions.push({
        m:  /^t(\+|\-|ø)?$/,
        fn: function (token, state) {
            var plist = token.plist;
            var tlang = plist[0];
            var text = plist[1];
            var e = state.element.create('tr');
            var g = plist[2];
            e.lang = tlang;
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
            tranBlock.text = token.argv[1] || '';
            tranBlock.lang = lang;
            state.element = tranBlock;
            skipToken(state, 'LF');
        }
    });

    templateProcessingFunctions.push({
        m:  /^trans\-bottom[0-9]*$/,
        fn: function (token, state) {
            if (state.element.eType == 'tran') {
                state.element = state.element.parent;
            }
            skipToken(state, 'LF');
        }
    });

    templateProcessingFunctions.push({
        m:  /^rel\-top[0-9]*$/,
        fn: function (token, state) {
            var tranBlock = state.element.create('rel');
            tranBlock.text = token.argv[1] || '';
            tranBlock.lang = lang;
            state.element = tranBlock;
            skipToken(state, 'LF');
        }
    });

    templateProcessingFunctions.push({
        m:  /^rel\-bottom[0-9]*$/,
        fn: function (token, state) {
            if (state.element.eType == 'rel') {
                state.element = state.element.parent;
            }
            skipToken(state, 'LF');
        }
    });

    templateProcessingFunctions.push({
        m:  /^rel\-mid[0-9]*$/,
        fn: function (token, state) {
            skipToken(state, 'LF');
        }
    });

    templateProcessingFunctions.push({
        m:  /^hyphenation$/,
        fn: function (token, state) {
            var text = token.argv.slice(1).join('-');
            state.element.appendText(text, lang);
        }
    });

    templateProcessingFunctions.push({
        m:  /^etyl$/,
        fn: function (token, state) {
            var text = token.argv[1];
            var set = {
                'enm': 'Middle English',
                'fro': 'Old French',
                'la':  'Latin'
            };
            text = set[text] || text;
            state.element.appendText(text, lang);
        }
    });

    templateProcessingFunctions.push({
        m:  /^suffix$/,
        fn: function (token, state) {
            var plist = token.plist;
            var tlang = token.kvp.lang || lang;
            var root = wDom.genLink(plist[0]);
            var suffix = plist[1];
            state.element.appendText(root + ' + -' + suffix, tlang);
        }
    });


    // rf.* templates are used to request information and should be ignored.
    templateProcessingFunctions.push({ m: /^(wikipedia|jump|rft-sense|rfdate|rfd-sense|rfc-.*|jump|rfex|rfdef|checksyns|trreq)\s*/, fn: tSkipEntry });

    exports.lang = lang;
    exports.templateProcessingFunctions = templateProcessingFunctions;

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
