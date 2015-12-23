<?php 
   header('Content-Type: text/html; charset=utf-8'); 

   $lang = $_GET['lang'] ? $_GET['lang'] : 'en';
   $word = $_GET['word'] ? $_GET['word'] : 'house';

?> 
<!DOCTYPE html>
<html lang="en">
<head>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="libs/knockout-2.2.1.js"></script>
    <script type="text/javascript" charset="utf-8" src="modulelib.js"></script>
    
    <script type="text/javascript">declareModule('wikiMarkupRenderer.js');</script>
    <script type="text/javascript" charset="utf-8" src="wikiMarkupRenderer.js"></script>

    <script type="text/javascript">declareModule('wmpTranslations.js');</script>
    <script type="text/javascript" charset="utf-8" src="wmpTranslations.js"></script>

    <script type="text/javascript">declareModule('wmpEnglish.js');</script>
    <script type="text/javascript" charset="utf-8" src="wmpEnglish.js"></script>

    <script type="text/javascript" charset="utf-8" src="wikimarkupparser.js"></script>
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
        <h2>Structure</h2>
        <div data-bind="attr: {id: 'output'+$index()}">
        <!-- ko template: wikiSelectTemplate($data.structure) --><!-- /ko -->
        </div>
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
            <ul style="list-style:none;">
            <!-- ko foreach: $data.elements --><li><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --></li><!-- /ko -->
            </ul>
        <!-- /ko -->
        <!-- ko if: $data.listType == ';' -->
            <ul style="list-style:none;">
            <!-- ko foreach: $data.elements --><li><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --></li><!-- /ko -->
            </ul>
        <!-- /ko -->
    </script>


    <script type="text/html" id="template_wiki_sectionA">
    <b><!-- ko template: wikiSelectTemplate($data.title) --><!-- /ko --></b>
    <div style="padding-left: 10px;border-left:1px solid #EEE">
        <!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko -->
    </div>
    </script>


    <script type="text/html" id="template_wiki_section">
    <b data-bind="text: $data.title.toText()"></b>
    <div style="padding-left: 10px;border-left:1px solid #EEE">
        <!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko -->
    </div>
    </script>


    <script type="text/html" id="template_wiki_pos">
    <b data-bind="text: properties.name"></b> - 
    <span data-bind="html: properties.value"></span>
    <?php /*
    <div style="padding-left: 10px;border-left:1px solid #EEE">
        <!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko -->
    </div>
    */ ?>
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
        <br />
    </script>

    <script type="text/html" id="template_wiki_lf">
    </script>

    <script type="text/html" id="template_wiki_link"><span style="color:blue" data-bind="text: $data.text, attr: {title: $data.link}"></span></script>

    <script type="text/html" id="template_wiki_xlink"> <a href='#' target="_blank" nofollow data-bind="attr: {'href':$data.url}, html: $data.text">[link]</a></script>

    <script type="text/html" id="template_wiki_template"><pre style="color:orange; display:inline-block;margin:0px;" data-bind="text: $data.text"></pre></script>

    <script type="text/html" id="template_wiki_quote"><span style="color:blue" data-bind="html: $data.text, attr: {title: $data.value}"></span></script>

    <script type="text/html" id="template_wiki_markup_i"><i><!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko --></i></script>

    <script type="text/html" id="template_wiki_markup_b"><b><!-- ko foreach: $data.elements --><!-- ko template: wikiSelectTemplate($data) --><!-- /ko --><!-- /ko --></b></script>

    <script type="text/html" id="template_wiki_text"><span data-bind="html: $data.text"></span></script>

    <script type="text/html" id="template_wiki_space"> </script>


    <script type="text/html" id="template_wiki_unknown">
    <pre style="color:red" data-bind="text: JSON.stringify($data, null, 2)"></pre>
    </script>

    <script type="text/javascript">$(function(){window.wikiView.search('<?php echo $lang?>','<?php echo $word?>');});</script>

</body>
</html>