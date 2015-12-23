/*

*/
"use strict";

(function(){
    var wikiMarkupParser = require('./wikimarkupparser.js');

    function searchWiktionary(lang, text)
    {
        return $.ajax({
            url: 'api.php',
            data: {
                action: 'search',
                lang: lang,
                q: text
            }
        });
    }


    function ViewModel()
    {
        var self = this;

        self.langList = ['en','nl','de','fr','es','sv'];
        self.searchTerm =
        {
            lang: ko.observable('en'),
            word: ko.observable('hand')
        };

        self.tokenSets = ko.observableArray([]);

        function processWiki(data)
        {
            var t = '';
            var j, k;
            var tokenText = [];
            self.tokenSets([]);

            var page = data;

            if (page)
            {
                t += '--------------------\n' + page.title + '\n';

                if (page.revision )
                {
                    var rev = page.revision;
                    t += '\n\n';
                    var raw = rev.text;
                    t += raw;

                    if (typeof (raw) == 'string') {
                        var ts = wikiMarkupParser(raw, self.searchTerm.lang(), page.title);
                        var tokens = ts.tokens;
                        self.tokenSets.push(ts);
                        for (k = 0; k < tokens.length; ++k)
                        {
                            var token = tokens[k];
                            tokenText.push(JSON.stringify(token));
                        }
                    }

                    t += '\n';
                }
            
            }

    
            $('#raw').text(t);
            $('#tokenized').text(tokenText.join("\n"));
        }


        self.fnSearch = function()
        {
            searchWiktionary(self.searchTerm.lang(), self.searchTerm.word()).done(processWiki);
        };

        self.search = function(lang, text)
        {
            self.searchTerm.lang(lang);
            self.searchTerm.word(text);
            self.fnSearch();
        };
    }

    var viewModel = new ViewModel();
    viewModel.wmr = require('./wikiMarkupRenderer.js');

    viewModel.wmr.setLinkFunction(function(lang, ref, text, fullLink)
    {
        if ((/^https?:/).test(ref))
        {
            return '<a href="'+ref+'" title="'+fullLink+'" target="_blank">'+text+'</a>';
        }
        return '<a href="?lang='+lang+'&amp;word='+ref+'" title="'+fullLink+'">'+text+'</a>';
    });

    window.wikiView = viewModel;
}());

$(function(){ko.applyBindings(window.wikiView);});

function wikiSelectTemplate(data)
{
    var map = {
        'section':'template_wiki_section',
        'text':'template_wiki_text',
        'list':'template_wiki_list',
        'li':'template_wiki_li',
        'link':'template_wiki_link',
        'xlink':'template_wiki_xlink',
        'template':'template_wiki_template',
        'title':'template_wiki_title',
        'root':'template_wiki_root',
        'quote':'template_wiki_quote',
        'pos':'template_wiki_pos',
        'tran':'template_wiki_tran',
        'tr':'template_wiki_tr',
        //'definition':'template_wiki_def',
        'examplelist':'template_wiki_example_list',
        'example':'template_wiki_example',
        'idiom':'template_wiki_idiom',
        'rel':'template_wiki_rel',
        'xref':'template_wiki_xref',
        'gender':'template_wiki_text',
        '<i>':'template_wiki_markup_i',
        '<b>':'template_wiki_markup_b',
        'lf':'template_wiki_lf',
        'br':'template_wiki_br'
    };

    var t = map[data.eType];

    // Exceptions;
    if (data.eType == 'text' && data.text && data.text.trim() === '')
    {
        t = 'template_wiki_space';
    }

    return {name: t || 'template_wiki_unknown', data: data};

}
