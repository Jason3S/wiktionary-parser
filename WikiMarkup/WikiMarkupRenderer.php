<?php
/**
 * Created by PhpStorm.
 * User: jason
 * Date: 12/28/13
 * Time: 09:13 AM
 */

function qh($text, $doubleEncode = true) {
    return htmlentities($text, ENT_QUOTES, 'UTF-8', $doubleEncode);
}

class WikiMarkupRenderer {

    public static function defaultLinkFunction($lang, $ref, $text, $wikiText) {
        if (preg_match('/^https?:/',$ref))
        {
            return '<a href="'.qh($ref,false).'" title="'.qh($wikiText).'" target="_blank">'.qh($text).'</a>';
        }
        return '<a href="?lang='.$lang.'&amp;word='.qh($ref,false).'" title="'.qh($wikiText).'">'.qh($text).'</a>';
    }


    public static function genImage($lang, $ref, $text, $wikiText) {
        return '<img src="'.qh($ref,false).'" title="'.qh($wikiText).'" /><span>'.qh($text).'</span>';
    }

    protected static function processMarkup($line, $rMarkup, $matrix) {
        $state = 0;
        $parts = array();
        $offset = 0;
        while (preg_match($rMarkup, $line, $matches, PREG_OFFSET_CAPTURE, $offset)) {
            $newOffset = $matches[0][1];
            $parts []= substr($line, $offset, $newOffset - $offset);
            $m = $matches[0][0];
            $mLen = strlen($m);
            $offset = $newOffset + $mLen;

            $action = $matrix[$state][$mLen];
            $state = $action['s'];
            $parts []=($action['t']);
        }

        if ($offset < strlen($line)) {
            $parts []= substr($line, $offset);
        }

        if ($state) {
            $action = $matrix[$state][$state];
            $parts []= $action['t'];
        }

        return implode('',$parts);
    }


    public static function convertMarkup($line) {
        $rMarkup = "/'[']+/";

        $matrix = array(
            array(
                array(),
                array(),
                array('t'=> '<i>', 's'=> 2),
                array('t'=> '<b>', 's'=> 3),
                array('t'=> '<b>\'', 's'=> 3),
                array('t'=> '<i><b>', 's'=> 5)
            ),  // no current markup
            array(),    // not a valid state
            array(
                array(),
                array(),
                array('t'=>'</i>', 's'=>0),
                array('t'=>'<b>', 's'=>5),
                array('t'=>'<b>\'', 's'=>5),
                array('t'=>'</i><b>', 's'=>3)
            ), // <i>
            array(
                array(),
                array(),
                array('t'=>'</b><i><b>', 's'=>5),
                array('t'=>'</b>', 's'=>0),
                array('t'=>'</b>\'', 's'=>0),
                array('t'=>'</b><i>', 's'=>2)
            ), // <b>
            array(),    // not a valid state
            array(
                array(),
                array(),
                array('t'=>'</b></i><b>', 's'=>3),
                array('t'=>'</b>', 's'=>2),
                array('t'=>'</b>\'', 's'=>2),
                array('t'=>'</b></i>', 's'=>0)
            ) // <i><b>
        );

        return static::processMarkup($line, $rMarkup, $matrix);
    }


    public static function wikiBoldItalics($wikiText) {
        $lines = explode("\n", $wikiText);
        $result = array();

        foreach ($lines as $line) {
            $result[] = static::convertMarkup($line);
        }
        return implode("\n", $result);
    }

    static $htmlBasicEscapeSequences = array(
        array('m'=>'/&/', 't'=>'&amp;'),
        array('m'=>'/</', 't'=>'&lt;'),
        array('m'=>'/>/', 't'=>'&gt;')
    );
    static $htmlUrlEscapeSequences = array(
        array('m'=>'/"/', 't'=>'&quot;'),
        array('m'=>'/\'/', 't'=>'&#39;'),
        array('m'=>'/\\/', 't'=>'&#92;')
    );

    static $htmlBasicUnEscapeSequences = array(
        array('m'=>'/&lt;/', 't'=>'<'),
        array('m'=>'/&gt;/', 't'=>'>'),
        array('m'=>'/&amp;/', 't'=>'&')
)   ;

    public static function applyEscapeSequence($sequence, $text) {
        foreach ($sequence as $s) {
            $text = preg_replace($s['m'], $s['t'], $text);
        }

        return $text;
    }

    public static function htmlEscape($text, $robust) {
        $text = static::applyEscapeSequence(static::$htmlBasicEscapeSequences, $text);

        if ($robust) {
            $text = static::applyEscapeSequence(static::$htmlUrlEscapeSequences, $text);
        }

        return $text;
    }

    public static function htmlUnEscape($text) {
        return static::applyEscapeSequence(static::$htmlBasicUnEscapeSequences, $text);
    }

    public static $externalLinkPattern = array(
        array('m'=>'/^w:/',                                             't'=>'http://<<$lang>>.wikipedia.org/wiki/',    'type'=>'link'),
        array('m'=>'/^(Wikisaurus:|Appendix:|Citations:|Template:)/i',  't'=>'http://<<$lang>>.wiktionary.org/wiki/$1', 'type'=>'link'),
        array('m'=>'/^[:]?s:/',                                         't'=>'http://<<$lang>>.wikisource.org/wiki/',   'type'=>'link'),
        array('m'=>'/^image:/i',                                        't'=>'',                                        'type'=>'ignore'), // Image
        array('m'=>'/^.{1,3}:/',                                        't'=>'',                                        'type'=>'ignore'),
    );

    public static function processLinkText($linkText, $lang) {
        // Need to check for various types of links.  For now, just return the last param value.
        $params = explode('|',$linkText);
        $ref = $params[0];
        $text = $params[count($params) - 1]; // htmlEscape(params[params.length - 1], true);
        $fullLink = $linkText;
        $linkType = 'link';

        if (preg_match('/:/',$ref)) {
            foreach (static::$externalLinkPattern as $elp) {
                if (preg_match($elp['m'], $ref)) {
                    $ref = preg_replace($elp['m'], $elp['t'], $ref);
                    $ref = str_replace('<<$lang>>', $lang, $ref);
                    $linkType = $elp['type'];
                    break;
                }
            }
        }

        if ($linkType == 'ignore') {
            return '';
        }

        if (!preg_match('/^https?:/', $ref)) {
            $ref = rawurlencode($ref);
        }

        return static::defaultLinkFunction($lang, $ref, $text, $fullLink);
    }

    public static function wikiLinks($wikiText, $lang) {

        // Process wiki links.
        $text = $wikiText;

        $rLink = '/^(.*?)(\[\[((?:(?:\[[^\[])|(?:[^\[\]])|(?:[^\]]\]))*)\]\])(.*?)$/';

        while (preg_match($rLink, $text, $m)) {
            $lhs = $m[1];
            $link =$m[3];
            $rhs = $m[4];
            $text = $lhs.static::processLinkText($link, $lang).$rhs;
        }

        return $text;
    }

    public static function externalLinks($text) {
        $rLink = '/^(.*?)(\[(http[^\s]*)\s*([^\]]*)\])(.*?)$/';

        while (preg_match($rLink, $text, $m)) {
            $lhs = $m[1];
            $link =$m[3];
            $title = $m[4];
            $rhs = $m[5];
            $text = $lhs.'<a target="_blank" nofollow href="'.qh($link, false).'" title="'.qh($title, false).'">'.qh($title, false).'</a>'.$rhs;
        }

        return $text;
    }

    public static function escapeValidWikiHtml($text) {
        $re = '/<\s*(\/?)\s*(small|sub|sup|h1|h2|h3|h4|h5|h6|p|br|hr|em|i|s|strong|u|dl|dt|dd|tt|blockquote|code|del|dfn)\s*(\/?)\s*>/i';


        $text = preg_replace($re, '!@@lt@@@__$1$2$3__@@@gt@@!', $text);

        $re = '/&(nbsp|rdquo|ldquo|mdash|amp|lt|gt|dash|quot|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|euro|hellip);/i';
        $text = preg_replace($re, '!@@a@@@__$1__@@@a@@!', $text);

        return $text;
    }

    public static function unescapeValidWikiHtml($text) {
        $re = '/!@@a@@@__(.*?)__@@@a@@!/';
        $text = preg_replace($re, '&$1;', $text);

        $re = '/!@@lt@@@__(.*?)__@@@gt@@!/';
        $text = preg_replace($re, '<$1>', $text);

        return $text;
    }

    public static function filterNoWiki($text) {
        $re = '/(<\s*nowiki\s*\/?\s*>)/';
        return preg_replace($re, '_@@__NoWiki__@@_', $text);
    }

    public static function cleanUpNoWiki($text) {
        $re = '/_@@__NoWiki__@@_/';
        return preg_replace($re, '', $text);
    }

    public static function stripHtml($text) {
        return preg_replace('/(<[^>]+>|\s*\{\{=\}\}\s*)/', '', $text);
    }

    public static function wikiMarkup2html($wikiText, $lang) {
        $text = $wikiText;
        if (empty($text)) {
            $text = '';
        }

        $text = static::filterNoWiki($text);
        $text = static::escapeValidWikiHtml($text);
        $text = static::stripHtml($text);
        $text = htmlentities($text, ENT_NOQUOTES, 'UTF-8', true);
        $text = static::unescapeValidWikiHtml($text);

        $text = static::wikiLinks($text, $lang);
        $text = static::externalLinks($text);

        $text = static::wikiBoldItalics($text);

        $text = static::cleanUpNoWiki($text);

        return $text;
    }

    public static function wikiMarkupLink2html($wikiText, $lang) {
        // Only wrap the text in a link if it doesn't already contain a link or other markup.
        $regSpecial = '/\'|\[|<|>/';
        if (!preg_match($regSpecial, $wikiText)) {
            $wikiText = '[['.$wikiText.']]';
        }

        return static::wikiMarkup2html($wikiText, $lang);
    }

    public static $genderMap = array(
        'm'=>'masculine gender','f'=>'feminine gender','n'=>'neuter gender', 'c'=>'common gender',
        // -- Additional qualifiers
        "an"=>"animate","in"=>"inanimate", "pr"=>"personal",

        // -- Numbers
        "s"=>"singular number", "d"=>"dual number", "p"=>"plural number",
        //-- Verb qualifiers
        "impf"=>"imperfective aspect", "pf"=>"perfective aspect"
    );

    public static function mapGender($gender) {
        $parts = explode('-', $gender);
        $map = static::$genderMap;

        return implode(', ', array_map(function ($e) use ($map) {
            return empty($map[$e]) ? '' : $map[$e];
        }, $parts));
    }

}
