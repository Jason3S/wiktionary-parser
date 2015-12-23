<?php 
   header('Content-Type: text/html; charset=utf-8'); 

   $lang = $_GET['lang'] ? $_GET['lang'] : 'en';
   $word = $_GET['word'] ? $_GET['word'] : 'house';

?> 
<!DOCTYPE html>
<html lang="en">
<head>
    <script type="text/javascript" charset="utf-8" src="libs/jquery-1.10.2.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="libs/knockout-2.2.1.debug.js"></script>
    <script type="text/javascript" charset="utf-8" src="modulelib.js"></script>

    <script type="text/javascript">declareModule('./wikiDomHelper.js');</script>
    <script type="text/javascript" charset="utf-8" src="wikiDomHelper.js"></script>

    <script type="text/javascript">declareModule('./processingState.js');</script>
    <script type="text/javascript" charset="utf-8" src="processingState.js"></script>

    <script type="text/javascript">declareModule('./wikimarkupelement.js');</script>
    <script type="text/javascript" charset="utf-8" src="wikimarkupelement.js"></script>

    <script type="text/javascript">declareModule('./wmpTranslations.js');</script>
    <script type="text/javascript" charset="utf-8" src="wmpTranslations.js"></script>

    <script type="text/javascript">declareModule('./wmpEnglish.js');</script>
    <script type="text/javascript" charset="utf-8" src="wmpEnglish.js"></script>

    <script type="text/javascript">declareModule('./wmpDutch.js');</script>
    <script type="text/javascript" charset="utf-8" src="wmpDutch.js"></script>

    <script type="text/javascript">declareModule('./wmpGerman.js');</script>
    <script type="text/javascript" charset="utf-8" src="wmpGerman.js"></script>

    <script type="text/javascript">declareModule('./wmpFrench.js');</script>
    <script type="text/javascript" charset="utf-8" src="wmpFrench.js"></script>

    <script type="text/javascript">declareModule('./wikimarkupstructure.js');</script>
    <script type="text/javascript" charset="utf-8" src="wikimarkupstructure.js"></script>

    <script type="text/javascript">declareModule('./wikimarkupparser.js');</script>
    <script type="text/javascript" charset="utf-8" src="wikimarkupparser.js"></script>

    <script type="text/javascript">declareModule('./wikiMarkupRenderer.js');</script>
    <script type="text/javascript" charset="utf-8" src="wikiMarkupRenderer.js"></script>

    <script type="text/javascript" charset="utf-8" src="wikiview.js"></script>
</head>
<body>
    Test Wiki Parsing.
    <form data-bind="submit: fnSearch">
        Lang: <select data-bind="options: langList, value: searchTerm.lang"></select>
        Word: <input data-bind="value: searchTerm.word" />
        <button type="submit">Search</button>
    </form>
    <!-- ko foreach: tokenSets -->
    <?php /*
        <h2>Translations</h2>
        <div style="width: 100%">
            <h3 data-bind="text: title + ' (' + lang + ')'"></h3>
            <!-- ko foreach: translationSets -->
                <dl>
                    <dt><span data-bind="text: title"></span><br/><span data-bind="text: defnr"></span>: <span data-bind="text: word, attr: {lang: lang}"></span> - <span data-bind="text: def, attr: {lang: lang}"></span></dt>
                    <!-- ko foreach: $data.trans -->
                        <dd>
                            <span data-bind="text: lang"></span>: 
                            <span data-bind="text: word, attr: {lang: lang}"></span><!-- ko if: $data.defnr --><sup data-bind="text: '[' + defnr + ']'"></sup><!-- /ko --><!-- ko if: $data.gender --><span data-bind="text: ', (' + gender + ')'"></span><!-- /ko -->
                        </dd>
                    <!-- /ko -->
                </dl>
            <!-- /ko -->
        </div>

    <h2>Translations</h2>
    <div style="width: 100%">
        <pre data-bind="text: JSON.stringify($data.translations, null, 2)"></pre>
    </div>


    */ ?>


        <h2>Structure</h2>
        <!-- ko template: wikiSelectTemplate($data.structure) --><!-- /ko -->
    <!-- /ko -->

    <h2>Raw</h2>
    <pre id="raw"></pre>

    <?php /* ?>
    <h2>Tokenized</h2>
    <pre id="tokenized"></pre>
    <?php */ ?>

    <!-- ko foreach: tokenSets -->
    <h2>Structure JSON</h2>
    <pre data-bind="text: JSON.stringify($data.structure, null, 2)"></pre>
    <h2>Translations JSON</h2>
    <pre data-bind="text: JSON.stringify($data.translations, null, 2)"></pre>
    <!-- /ko -->


    <script type="text/html" id="template_wiki_list">
        <!-- ko if: $data.listType == '#' -->
            <ol>
            <!-- ko foreach: $data.elements --><li><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --></li><!-- /ko -->
            </ol>
        <!-- /ko -->
        <!-- ko if: $data.listType == '*' -->
            <ul>
            <!-- ko foreach: $data.elements --><li><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --></li><!-- /ko -->
            </ul>
        <!-- /ko -->
        <!-- ko if: $data.listType == ':' -->
            <div style="padding-left: 10px;color: green;">
            <!-- ko foreach: $data.elements --><div>:: <!-- ko template: wikiSelectTemplate($data) --><!-- /ko --></div><!-- /ko -->
            </div>
        <!-- /ko -->
        <!-- ko if: $data.listType == ';' -->
            <div style="padding-left: 10px;color: blue;">
            <!-- ko foreach: $data.elements --><div>;; <!-- ko template: wikiSelectTemplate($data) --><!-- /ko --></div><!-- /ko -->
            </div>
        <!-- /ko -->
    </script>


    <script type="text/html" id="template_wiki_section">
    <div>
        <b data-bind="text: $root.wmr.toHtml(text, lang)"></b>
        <div style="padding-left: 10px;border-left:1px solid #EEE">
            <!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko -->
        </div>
    <div>
    </script>


    <script type="text/html" id="template_wiki_pos">
    <b data-bind="text: name"></b> -
    <span data-bind="html: $root.wmr.toHtml(text, lang)"></span>
    </script>

    <script type="text/html" id="template_wiki_tran">
        <b data-bind="html: $root.wmr.toHtml($data.text, $data.lang)"></b>
        <!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko -->
    </script>

    <script type="text/html" id="template_wiki_rel">
        <b data-bind="html: $root.wmr.toHtml($data.text, $data.lang)"></b>
        <!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko -->
    </script>

    <script type="text/html" id="template_wiki_example_list">
        <div style="padding-left: 10px;color: green;">
            <!-- ko foreach: $data.elements --><div>&lfloor; <!-- ko template: wikiSelectTemplate($data) --><!-- /ko --></div><!-- /ko -->
        </div>
    </script>

    <script type="text/html" id="template_wiki_example">
        <span data-bind="html: $root.wmr.toHtml($data.text, $data.lang)"></span>
    </script>

    <script type="text/html" id="template_wiki_idiom">
        <dl>
            <dt data-bind="html: $root.wmr.toHtml($data.text, $data.lang)"></dt>
            <dd data-bind="html: $root.wmr.toHtml($data.def, $data.lang)">></dd>
        </dl>
    </script>


    <script type="text/html" id="template_wiki_title">
        <!-- ko if: $data.elements --><!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko --><!-- /ko -->
    </script>


    <script type="text/html" id="template_wiki_root">
        <!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko -->
    </script>

    <script type="text/html" id="template_wiki_li">
        <!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko -->
    </script>


    <script type="text/html" id="template_wiki_br">
        ↲<br />
    </script>

    <script type="text/html" id="template_wiki_lf">
    </script>

    <script type="text/html" id="template_wiki_link"><span style="color:blue" data-bind="text: $data.text, attr: {title: $data.link}"></span></script>

    <script type="text/html" id="template_wiki_xlink"> <a href='#' target="_blank" nofollow data-bind="attr: {'href':$data.url}, html: $root.wmr.toHtml($data.text, $data.lang)">[link]</a></script>

    <script type="text/html" id="template_wiki_template"><pre style="color:orange; display:inline-block;margin:0px;" data-bind="text: $data.text"></pre></script>

    <script type="text/html" id="template_wiki_quote"><span style="color:blue" data-bind="html: $root.wmr.toHtml($data.text, $data.lang), attr: {title: $data.value}"></span></script>

    <script type="text/html" id="template_wiki_markup_i"><i><!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko --></i></script>

    <script type="text/html" id="template_wiki_markup_b"><b><!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko --></b></script>

    <script type="text/html" id="template_wiki_text"><span data-bind="html: $root.wmr.toHtml($data.text, $data.lang)"></span></script>

    <script type="text/html" id="template_wiki_xref"><span data-bind="text: $data.text"></span></script>

    <script type="text/html" id="template_wiki_tr"><span data-bind="html: $root.wmr.toLink($data.text, $data.lang)"></span><!-- ko if: $data.gender --><sup data-bind="text: $data.gender, attr: {title: $root.wmr.mapGender($data.gender)}"></sup><!-- /ko --></script>

    <script type="text/html" id="template_wiki_space"> </script>


    <script type="text/html" id="template_wiki_unknown">
    <pre style="color:red" data-bind="text: JSON.stringify($data, null, 2)"></pre>
    </script>

    <script type="text/javascript">$(function(){window.wikiView.search('<?php echo $lang?>','<?php echo $word?>');});</script>

</body>
</html>