// wikimarkupparser.js

/*
 * Convert a WikiMarkup to a json structure.
 *
 * structure elements: sections, lists
 *
 * sections -- used to contain the content under a header
 *      - type: 'section'
 *      - title[]: the text within the == .* ==
 *      - content[]: array of content. 
 *
 * inline markup -- italic, bold
 *
 * {{property}}
 *
 * [[link]] 
 */

(function () {
    "use strict";

    var wikiMarkupStructure = require('./wikimarkupstructure.js');

    var supportedLanguages = {en: true, nl: true, de: true, fr: true, es: true, sv: true};

    var templates = {
        en:      {
            title:    {m: '{{pn}}', t: ''},
            "static": [
                {m: '{{p}}', t: '(plural)'},
                {m: /\{\{trans-mid\}\}\s*/g, t: ''},
                {m: /\=\=\s*(.*?)\{\{abbreviation\}\}(.*?)\s*\=\=/g, t: '==$1Abbreviation$2=='},
                {m: /\=\=\s*(.*?)\{\{initialism\}\}(.*?)\s*\=\=/g, t: '==$1Initialism$2=='},
                {m: /\=\=\s*(.*?)\{\{acronym\}\}(.*?)\s*\=\=/g, t: '==$1Acronym$2=='},
                {m: '$$end$$', t: '$$end$$'}
            ]
        },
        nl:      {
            title:    {m: '{{pn}}', t: ''},
            "static": [
                //{m: '{{n}}',                            t: '[het]'},
                //{m: '{{m}}',                            t: '[de (m)]'},
                //{m: '{{f}}',                            t: '[de (f)]'},
                {m: '$$end$$', t: '$$end$$'}
            ]
        },
        de:      {
            title:    {m: '{{pn}}', t: ''},
            "static": [
                {m:/\=+\s*(Ü|U)bersetzungen\s*=+/ig, t:'{{Übersetzungen}}'},
                {m:/\=+\s*(\{\{.*?\}\})\s*=+/g, t:'$1'},

                //{m: '=Übersetzungen=', t: '=Translations='},
                //{m: '= Übersetzungen =', t: '=Translations='},
                //{m: '{{Bedeutungen}}', t: '====Definition===='},
                //{m: '{{Sprache|Deutsch}}', t: 'German'},
                //{m: '{{Wortart|Substantiv|Deutsch}}', t: 'Noun'},
                //{m: '{{Wortart|Verb|Deutsch}}', t: 'Verb'},
                //{m: '{{Wortart|Adjektiv|Deutsch}}', t: 'Adjective'},
                //{m: '{{Wortart|Adverb|Deutsch}}', t: 'Adverb'},
                //{m: '{{n}}',                            t: '(n)'},
                //{m: '{{m}}',                            t: '(m)'},
                //{m: '{{f}}',                            t: '(f)'},
                {m: '$$end$$', t: '$$end$$'}
            ]
        },
        fr:      {
            title:    {m: '{{pn}}', t: ''},
            "static": [
                {m: /(=+)\s*\{\{S\|(.*?)\}\}\s*=+/g, t: '{{S$1|$2}}'},
                {m: /\==+\s*\{\{(langue.*?)\}\}\s*==/g, t: '{{$1}}'},
                {m: '$$end$$', t: '$$end$$'}
            ]
        },
        es:      {
            title: {m: '{{pn}}', t: ''}
        },
        sv:      {
            title: {m: '{{pn}}', t: ''}
        },
        general: {
            "static": [
                {m: /([^\[]|^)\[(?!\[)((?:\d|-|–|,|\s)+)\]/gm, t: '$1__§REF§__!$2!__§FER§__'},
                {m: /^(\=\=+)\s*(.*?)\s*(\=\=+)\s*$/gm, t: '$1$2$3'},
                {m: '{{,}}', t: ','},
                {m: '{{...}}', t: '&hellip;'},
                {m: /\{\{(2x)?----+\}\}/g, t: ''},
                {m: /(\{\{)?----+(\}\})?/g, t: ''}
                /*
                {m: /(\{\{)?----+(\}\})?/g, t: '<hr/>'},
                {m: '=Traducciones=', t: '=Translations='},
                {m: '= Traducciones =', t: '=Translations='},
                {m: '{{...}}', t: '…'},
                {m: '{{eng}}', t: 'English'},
                {m: '{{nld}}', t: 'Dutch'},
                {m: '{{deu}}', t: 'German'},
                {m: '{{fra}}', t: 'French'},
                {m: '{{spa}}', t: 'Spanish'},
                {m: '{{swe}}', t: 'Swedish'},
                {m: '{{en}}', t: 'English'},
                {m: '{{nl}}', t: 'Dutch'},
                {m: '{{de}}', t: 'German'},
                {m: '{{fr}}', t: 'French'},
                {m: '{{es}}', t: 'Spanish'},
                {m: '{{sv}}', t: 'Swedish'},
                {m: '{{=eng=}}', t: '==English=='},
                {m: '{{=nld=}}', t: '==Dutch=='},
                {m: '{{=deu=}}', t: '==German=='},
                {m: '{{=fra=}}', t: '==French=='},
                {m: '{{=spa=}}', t: '==Spanish=='},
                {m: '{{=swe=}}', t: '==Swedish=='},
                {m: '{{-verb-}}', t: '===Verb==='},
                {m: '{{-verb-|fr}}', t: '===Verb==='},
                {m: '{{-noun-}}', t: '===Noun==='},
                // {m: '{{-noun-|nld}}', t: '===Noun==='},
                {m: '{{-nom-|fr}}', t: '===Noun==='},
                {m: '{{-info-}}', t: '===Information==='},
                {m: '{{-prép-|fr}}', t: '===Preposition==='},
                {m: '{{-pron-}}', t: '====Pronunciation===='},
                {m: '{{-note-}}', t: '=====Note====='},
                {m: '{{-rel-}}', t: '=====Related Terms====='},
                {m: '{{-tran-}}', t: '=====Translations====='},
                {m: '{{-trad-}}', t: '=====Translations====='},
                {m: '{{-trans-}}', t: '=====Translations====='},
                {m: '{{-prov-}}', t: '=====Idioms====='},
                {m: '{{-syn-}}', t: '=====Synonyms====='},
                {m: '{{-expr-}}', t: '=====Expressions====='},
                {m: '{{-exp-}}', t: '=====Expressions====='},
                {m: '{{-syll-}}', t: '=====Syllables====='},
                {m: '{{-etym-}}', t: '=====Entomology====='},
                {m: '{{-hypo-}}', t: '=====Hyponym====='},
                {m: '{{-drv-}}', t: '=====Derivative====='}
                */
            ]
        }
    };


    function splitKvpParam(p) {
        var regs = [
            /(\{[^}]*)=([^}]*\})/g,
            /(\([^)]*)=([^)]*\))/g,
            /(\[[^\]]*)=([^\]]*\])/g
        ];
        var i;

        for (i = 0; i < regs.length; ++i) {
            var n = '';
            var r = regs[i];

            while (p != n) {
                n = p;
                p = p.replace(r, '$1!__!__!$2');
            }
        }

        p = p.replace(/\s*\=\s*/, '!#_#_#_#!');
        p = p.replace(/!__!__!/g, '=');

        var parts = p.split('!#_#_#_#!');

        return parts;
    }


    function splitParamKvp(params) {
        var kvps = {};
        var kvp;
        var i;

        for (i = 0; i < params.length; ++i) {
            kvp = splitKvpParam(params[i]);
            if (kvp.length == 2) {
                kvps[kvp[0].trim()] = kvp[1].trim();
            }
        }

        return kvps;
    }

    function genPlist(argv) {
        var reMatchHeader = /\=/;
        var plist = argv.slice(1);
        return plist.filter(function(v){
            return !reMatchHeader.test(v);
        });
    }


    function splitParams(p) {
        // We need to make sure we don't split across sub tokens.
        // Example: 'quote-book|passage=[[life|Life]] on the open sea|title=Lost at sea|page=55'
        // Becomes: ['quote-book','passage=[[life|Life]] on the open sea','title=Lost at sea','page=55']
        var params = {};

        // first replace the '|' with something we know

        var regs = [
            /(\{[^}]*)\|([^}]*\})/g,
            /(\([^)]*)\|([^)]*\))/g,
            /(\[[^\]]*)\|([^\]]*\])/g
        ];

        var i;

        for (i = 0; i < regs.length; ++i) {
            var n = '';
            var r = regs[i];

            while (p != n) {
                n = p;
                p = p.replace(r, '$1!__!__!$2');
            }
        }

        p = p.replace(/\s*\|\s*/g, '!#_#_#_#!');
        p = p.replace(/!__!__!/g, '|');

        params.argv = p.split('!#_#_#_#!');

        params.kvp = splitParamKvp(params.argv);

        params.plist = genPlist(params.argv);

        return params;
    }

    var tokenizePatterns =
        [
            // Null function
            function () {
            },
            // Section
            function (v) {
                var p = /^\s*(=+)(.*?)=+\s*$/;
                var parts = v.match(p);
                return { token: 'Section', text: parts[2], value: v, depth: parts[1].length };
            },
            // List
            function (v) {
                return { token: 'List', value: v, depth: v.length };
            },
            // Template
            function (v) {
                var p = v.replace('{{', '');
                p = p.replace(/\}\}\s*$/, '');
                p = p.trim();
                var params = splitParams(p);
                return {
                    token:  'Template',
                    name:   params.argv[0].trim(),
                    params: params,
                    argv: params.argv,
                    plist: params.plist,
                    kvp: params.kvp,
                    value:  p,
                    raw: v
                };
            },
            // Comment Start
            function (v) {
                return { token: '/*' };
            },
            // Comment Stop
            function (v) {
                return { token: '*/' };
            },
            // html
            function (v) {
                return { token: 'html', value: v };
            },
            function (v) {
                return { token: '/html', value: v };
            },
            function (v) {
                v = v.replace(/__§REF§__!|!__§FER§__/g, '');
                v = v.replace(/–/g, '-');  // normalize the dashes to the same one.
                var r = v.split(',').map(function(item) { return item.trim();});
                var rList = [];
                r.forEach(function(item) {
                    var p = item.split('-');
                    var i = p[0];
                    var j = p.pop();
                    for (i; i <= j; ++i) {
                        rList.push(i);
                    }
                });
                rList.sort(function(a,b){ return a - b; });
                return { token: 'XRef', text: '['+v+']', ref: rList.join(',')};
            },
            // end
            function () {
            }
        ];
    tokenizePatterns.Text = function (v) {
        return { token: 'Text', value: v };
    };
    tokenizePatterns.LF = function () {
        return { token: 'LF' };
    };


    function tokenize(wikimarkup) {
        var tokens = [],
            i, j, m, line, lines,
            tokenPattern,
            match, idx = 0, tfn;

        function tokenizeText(text) {
            var lines = text.split('\n');
            var j;
            for (j = 0; j < lines.length; ++j) {
                if (j > 0) {
                    tokens.push(tokenizePatterns.LF());
                }
                var t = lines[j];
                if (t !== '') {
                    tokens.push(tokenizePatterns.Text(t));
                }
            }
        }

        // 1 == header
        // 2 == list
        // 3 == template
        // 4 == comment start
        // 5 == comment end
        // 6 == start html
        // 7 == stop html
        tokenPattern = /(^==+.*==+\s*$)|(^[#*:;]+)|(\{\{[^\{\}]*?(?:\{\{[^\{\}]*?\}\}[^\{\}]*?)*?\}\})|(<!--)|(-->)|(<\s*\w+\s*\/?\s*>)|(<\s*\/\s*\w+\s*>)|(__§REF§__.+?__§FER§__)/gm;

        lines = [wikimarkup];

        for (i = 0; i < lines.length; ++i) {
            line = lines[i];
            idx = 0;

            while ((match = tokenPattern.exec(line)) !== null) {
                // push any text that was skipped.
                if (match.index != idx) {
                    tokenizeText(line.substring(idx, match.index));
                }
                idx = match.index + match[0].length;

                for (j = 1; j < match.length; ++j) {
                    m = match[j];
                    if (m !== undefined) {
                        var token = tokenizePatterns[j](m);
                        if (token) {
                            tokens.push(token);
                        }
                        break;  // stop on first match.
                    }
                }
            }

            if (idx < line.length) {
                tokenizeText(line.substring(idx));
            }
        }

        return tokens;
    }

    var matchRegexSpecialCharacters = /([.?*+\^$\[\]\\(){}|\-])/g;

    function regexEscape(str) {
        return String(str).replace(matchRegexSpecialCharacters, "\\$1");
    }

    function asRegEx(m, forceGlobal) {
        if (!(m instanceof RegExp)) {
            m = new RegExp(regexEscape(m), 'g');
        }
        else if (forceGlobal && !m.global) {
            var mod = 'g' + (m.ignoreCase) ? 'i' : '';
            m = new RegExp(m.source, mod);
        }

        return m;
    }

    function substituteTemplates(str, templates) {
        var i;
        if (templates) {
            for (i = 0; i < templates.length; ++i) {
                var t = templates[i];
                var m = asRegEx(t.m, true);
                str = str.replace(m, t.t);
            }
        }

        return str;
    }


    function substituteStaticTemplates(raw, lang, title) {
        var st, p, m, t,
            s = raw;

        t = templates[lang].title;
        t.t = title;

        s = substituteTemplates(s, [templates[lang].title]);
        s = substituteTemplates(s, templates[lang]['static']);
        s = substituteTemplates(s, templates.general['static']);

        return s;
    }

    function decodeTranslationTemplate(token, tokens, index) {
        // translation templates:
        // t+|nl|huis
        // t+|nl|1|huis   -- huis^[1]
        // t+|nl|huis|n   -- huis, het
        // t+|nl|1|huis|n -- huis^[1], het
        // t+|nl|huis,|gebouw|
        // t+|en|1|road|,|1|route|,|1|way|,|2|path

        // get the params and skip the 
        var reIsNumeric = /^(\s*[0-9?]+[a-zA-Z]*[,.\-–]*)+\s*$/;
        var lang = token.argv[1];
        var parts = token.argv.slice(2);
        var s = parts.join('|');
        var trans = s.split('|,|');
        var r = [];
        var defnrDefault = null;
        var genderDefault = null;
        var defnr;

        var t, m, j, i; // temp variables.

        if (index > 0 && tokens[index - 1].token == 'Text') {
            t = tokens[index - 1];
            m = t.value.match(/\[([0-9]+[, \-–0-9a-zA-Z]*)\]\s*$/);
            if (m) {
                defnrDefault = m[1];
            }
        }

        if (index < tokens.length - 1) {
            j = index + 1;
            t = tokens[j];
            if (t.token == 'Text' && t.value.trim() === '' && j < tokens.length - 1) {
                ++j;
                t = tokens[j];
            }
            if (t.token == 'Template') {
                m = t.params.argv[0].match(/[mfnc]/);
                if (m) {
                    genderDefault = m[0];
                }
            }
        }


        for (i = 0; i < trans.length; ++i) {
            t = trans[i];
            parts = t.split('|');
            defnr = defnrDefault;

            if (reIsNumeric.test(parts[0])) {
                defnr = parts.shift();
            }
            if (reIsNumeric.test(parts[0])) {
                defnr += ',' + parts.shift();
            }
            defnrDefault = defnr;


            var w = parts.shift() || '';
            var g = parts.shift() || genderDefault;

            var ts = {
                lang:   lang,
                word:   w,
                defnr:  defnr,
                gender: g
            };

            r.push(ts);
        }

        return r;
    }

    function wikiMarkupParser(raw, lang, title) {
        var s = substituteStaticTemplates(raw, lang, title);

        var tokens = tokenize(s);

        var value = {
            lang:            lang,
            title:           title,
            tokens:          tokens,
            structure:       wikiMarkupStructure.extractStructure(tokens, lang, title, true)
        };

        value.translations = wikiMarkupStructure.extractTranslationsFromStructureFlat(value.structure);

        // Make sure we can serialize the tree by removing the parent references.
        wikiMarkupStructure.removeParentReferences(value.structure);

        return value;

    }

    wikiMarkupParser.parseEmbedded = function(raw, lang, title) {
        var tokens = tokenize(raw);
        return wikiMarkupStructure.extractStructure(tokens, lang, title, false);
    };

    module.exports = wikiMarkupParser;

    // window.wikiMarkupParser = wikiMarkupParser;

}());
