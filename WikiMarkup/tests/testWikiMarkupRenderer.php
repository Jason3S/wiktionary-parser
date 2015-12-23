<?php
/**
 * Created by PhpStorm.
 * User: jason
 * Date: 12/28/13
 * Time: 13:53 PM
 */

require('../WikiMarkupRenderer.php');

$testStrings = array(
    'Hello this is a link: [[link]]',
    "This is '''bold''' and this is ''italics'' and this is '''''bold italics'''''",
    "Here is a nested link: [[word|the word or [[phrase]]]] you need to look up."
);

foreach ($testStrings as $s) {
    echo '>>',$s,"<<\n";
    echo '>>',WikiMarkupRenderer::wikiMarkup2html($s, 'en'),"<<\n\n";
}
