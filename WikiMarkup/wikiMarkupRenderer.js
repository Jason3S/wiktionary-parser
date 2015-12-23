// wikiMarkupRenderer.js

(function () {
    "use strict";

    function defaultLinkFunction(lang, ref, text, wikiText) {
        return '<u title="' + wikiText + '">' + text + '</u>';
    }


    function genImage(lang, ref, text, wikiText) {
        return '<img src="' + ref + '" title="' + wikiText + '" /><span>' + text + '</span>';
    }


    var linkFunction = defaultLinkFunction;

    function wikiBoldItalics(wikiText) {

        function convertMarkup(line) {
            var state = 0;
            var rMarkup = /'[']+/g;
            var parts = [];

            var m;
            var index = 0;
            var action;

            var matrix = [
                [
                    {},
                    {},
                    {t: '<i>', s: 2},
                    {t: '<b>', s: 3},
                    {t: '<b>\'', s: 3},
                    {t: '<i><b>', s: 5}
                ],  // no current markup
                [],                                                                                   // not a valid state
                [
                    {},
                    {},
                    {t: '</i>', s: 0},
                    {t: '<b>', s: 5},
                    {t: '<b>\'', s: 5},
                    {t: '</i><b>', s: 3}
                ], // <i>
                [
                    {},
                    {},
                    {t: '</b><i><b>', s: 5},
                    {t: '</b>', s: 0},
                    {t: '</b>\'', s: 0},
                    {t: '</b><i>', s: 2}
                ], // <b>
                [],                                                                                   // not a valid state
                [
                    {},
                    {},
                    {t: '</b></i><b>', s: 3},
                    {t: '</b>', s: 2},
                    {t: '</b>\'', s: 2},
                    {t: '</b></i>', s: 0}
                ] // <i><b>
            ];


            while ((m = rMarkup.exec(line)) != null) {
                if (m.index > index) {
                    parts.push(line.substring(index, m.index));
                }
                index = rMarkup.lastIndex;

                action = matrix[state][m[0].length];
                state = action.s;
                parts.push(action.t);
            }

            if (index < line.length) {
                parts.push(line.substr(index));
            }

            if (state) {
                action = matrix[state][state];
                parts.push(action.t);
            }

            return parts.join('');
        }

        var lines = wikiText.split('\n');
        var result = [];
        var i;

        for (i = 0; i < lines.length; ++i) {
            result.push(convertMarkup(lines[i]));
        }

        return result.join('\n');
    }

    var htmlBasicEscapeSequences = [
        {m: /&/g, t: '&amp;'},
        {m: /</g, t: '&lt;'},
        {m: />/g, t: '&gt;'}
    ];
    var htmlUrlEscapeSequences = [
        {m: /"/g, t: '&quot;'},
        {m: /'/g, t: '&#39;'},
        {m: /\\/g, t: '&#92;'}
    ];

    var htmlBasicUnEscapeSequences = [
        {m: /&lt;/g, t: '<'},
        {m: /&gt;/g, t: '>'},
        {m: /&amp;/g, t: '&'}
    ];

    function applyEscapeSequence(sequence, text) {
        var i;
        for (i = 0; i < sequence.length; ++i) {
            var s = sequence[i];
            text = text.replace(s.m, s.t);
        }
        return text;
    }

    function htmlEscape(text, robust) {
        text = applyEscapeSequence(htmlBasicEscapeSequences, text);

        if (robust) {
            text = applyEscapeSequence(htmlUrlEscapeSequences, text);
        }

        return text;
    }

    function htmlUnEscape(text) {
        return applyEscapeSequence(htmlBasicUnEscapeSequences, text);
    }

    function wikiLinks(wikiText, lang) {
        function processLinkText(linkText) {
            // Need to check for various types of links.  For now, just return the last param value.
            var params = linkText.split('|');
            var ref = params[0];
            var text = params[params.length - 1]; // htmlEscape(params[params.length - 1], true);
            var fullLink = htmlEscape(linkText, true);
            var r;
            var linkType = 'link';

            if ((/:/).test(ref)) {
                if ((r = /^w:/).test(ref)) {
                    ref = ref.replace(r, 'http://' + lang + '.wikipedia.org/wiki/');
                } else  if ((/^(Wikisaurus:|Appendix:|Citations:|Template:)/i).test(ref)) {
                    ref = 'http://' + lang + '.wiktionary.org/wiki/' + ref;
                } else if ((r = /^(s:|:s:)/).test(ref)) {
                    ref = ref.replace(r, 'http://' + lang + '.wikisource.org/wiki/');
                } else if ((r = /^[iI]mage:/).test(ref)) {
                    linkType = 'Ignore'; // 'Image';
                    ref = ref.replace(r, 'http://upload.wikimedia.org/wikipedia/commons/a/a5/');
                } else if ((r = /^.{1,3}:/).test(ref)) {
                    linkType = 'Ignore';
                }
            } else {
                ref = ref.replace(/#.*/,'');
            }

            if (linkType == 'Ignore') {
                return text;
            }

            if (!(/^https?:/).test(ref)) {
                ref = encodeURIComponent(ref);
            }

            ref = htmlEscape(ref, true);

            if (linkType == 'Image') {
                return genImage(lang, ref, text, fullLink);
            }

            return linkFunction(lang, ref, text, fullLink);
        }

        // Process wiki links.
        var text = wikiText;

        var rLinkTokens = /(\[\[)|(\]\])/g;

        var lastText;

        do
        {
            lastText = text;


            var m;
            var state = 0;
            var index = 0;
            var startIndex = 0;
            var captureIndex = 0;
            var capturedText;
            var parts = [];

            while ((m = rLinkTokens.exec(text)) != null) {
                if (m[1]) {
                    // We found a start link token.
                    // We don't care if we already found a start token, just move the index forward
                    // we will pick up the outter link the next time though the outter loop.
                    state = 1;
                    startIndex = m.index;
                    captureIndex = rLinkTokens.lastIndex;
                } else {
                    // We found a stop link token.
                    if (state) {
                        // We are currently capturing the link.
                        // remember everthing before the capture.
                        parts.push(text.substring(index, startIndex));
                        capturedText = text.substring(captureIndex, m.index);
                        index = rLinkTokens.lastIndex;  // Move the index to after the link.
                        parts.push(processLinkText(capturedText));
                        state = 0;
                    }
                    /*
                     else
                     {
                     // Do nothing, we are mostlikely in a nested link, so we will just skip the stop token.
                     }
                     */
                }
            }

            if (index < text.length) {
                parts.push(text.substring(index, text.length));
            }

            text = parts.join('');
            parts = [];

        } while (lastText != text);

        return text;
    }

    function externalLinks(text) {
        var r = /\[(http[^\s]*)\s*([^\]]*)\]/g;
        var index = 0;
        var parts = [];
        var m;

        while ((m = r.exec(text)) != null) {
            if (index < m.index) {
                parts.push(text.substring(index, m.index));
            }

            index = r.lastIndex;
            var link = htmlUnEscape(m[1]);  // We don't want to double escape it, so first undo it just incase.
            var ref = htmlEscape(link, true);
            var linkText = htmlEscape(m[2] || m[0], false);
            var fullLink = htmlEscape(m[0], true);
            parts.push('<a target="_blank" nofollow href="' + ref + '" title="' + fullLink + '">' + linkText + '</a>');
        }

        if (index < text.length) {
            parts.push(text.substring(index));
        }

        return parts.join('');
    }

    function escapeValidWikiHtml(text) {
        var re = /<\s*(\/?)\s*(small|sub|sup|h1|h2|h3|h4|h5|h6|p|br|hr|em|i|s|strong|u|dl|dt|dd|tt|blockquote|code|del|dfn)\s*(\/?)\s*>/ig;


        text = text.replace(re, '!@@lt@@@__$1$2$3__@@@gt@@!');

        re = /&(nbsp|rdquo|ldquo|mdash|amp|lt|gt|dash|quot|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|euro|hellip);/ig;
        text = text.replace(re, '!@@a@@@__$1__@@@a@@!');

        return text;
    }

    function unescapeValidWikiHtml(text) {
        var re;
        re = /!@@a@@@__(.*?)__@@@a@@!/g;
        text = text.replace(re, '&$1;');

        re = /!@@lt@@@__(.*?)__@@@gt@@!/g;
        text = text.replace(re, '<$1>');

        return text;
    }

    function filterNoWiki(text) {
        var re = /(<\s*nowiki\s*\/?\s*>)/g;
        return text.replace(re, '_@@__NoWiki__@@_');
    }

    function cleanUpNoWiki(text) {
        var re = /_@@__NoWiki__@@_/g;
        return text.replace(re, '');
    }

    function stripHtml(text) {
        return text.replace(/(<[^>]+>|\s*\{\{=\}\}\s*)/g, '');
    }

    function fixTemplates(wikiText, lang) {
        var r = /\{\{([^{}]+)\}\}/g;
        var m;
        var index = 0;
        var parts = [];
        while ((m = r.exec(wikiText)) != null) {
            if (index < m.index) {
                parts.push(wikiText.substring(index, m.index));
            }
            index = r.lastIndex;

            var list = m[1].replace(/\s*\|\s*/g, ', ').trim();
            parts.push('(' + list + ')');
        }

        if (index < wikiText.length) {
            parts.push(wikiText.substring(index));
        }

        return parts.join('');
    }

    function wikiMarkup2html(wikiText, lang) {
        var text = wikiText;
        if (text === undefined) {
            text = '<b>UNDEFINED</b>';
        }
        text = fixTemplates(text);
        text = filterNoWiki(text);
        text = escapeValidWikiHtml(text);
        text = stripHtml(text);
        text = htmlEscape(text);
        text = unescapeValidWikiHtml(text);

        text = wikiLinks(text, lang);
        text = externalLinks(text);

        text = wikiBoldItalics(text);

        text = cleanUpNoWiki(text);

        return text;
    }

    function wikiMarkupLink2html(wikiText, lang) {
        if (wikiText === undefined) {
            // return '';
            wikiText = 'undefined';
        }

        // Only wrap the text in a link if it doesn't already contain a link or other markup.
        var regSpecial = /'|\[|<|>/;
        if (!regSpecial.test(wikiText)) {
            var lhs = '[[', rhs = ']]';
            var parts = wikiText.split(',');
            var t = parts[0];
            var w = t.trim();
            var ends = t.split(w);
            w = lhs + w + rhs;
            parts[0] = ends.join(w);
            wikiText = parts.join(',');
        }

        return wikiMarkup2html(wikiText, lang);
    }

    var genderMap = {
        'm':'masculine gender','f':'feminine gender','n':'neuter gender', 'c':'common gender',
        // -- Additional qualifiers
        "an": "animate","in":"inanimate", "pr":"personal",

        // -- Numbers
        "s":"singular number", "d":"dual number", "p":"plural number",
        //-- Verb qualifiers
        "impf":"imperfective aspect", "pf": "perfective aspect"
    };

    exports.mapGender = function(gender) {
        var parts = gender.split('-');

        return parts.map(function(e,i,a){ return genderMap[e] || ''; }).join(', ');
    };

    exports.toHtml = wikiMarkup2html;
    exports.toLink = wikiMarkupLink2html;
    exports.setLinkFunction = function (fn) {
        linkFunction = fn;
    };

}());
