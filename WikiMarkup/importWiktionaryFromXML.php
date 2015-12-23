<?php
/**
 * Created by PhpStorm.
 * User: jason
 * Date: 1/23/14
 * Time: 07:27 AM
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once('./libs/tools.php');

class WiktionaryDB {
    protected static $mongoClient = null;

    static function getMongoClient() {
        if (!isset(self::$mongoClient)) {
            self::$mongoClient = new MongoClient();
        }

        return self::$mongoClient;
    }


    public static function getMongoCollection() {
        // connect
        $m = self::getMongoClient();

        // select a database
        $db = $m->wiktionary;

        // select a collection (analogous to a relational database's table)
        $collection = $db->pages;

        return $collection;
    }

    public static function getOldMongoCollection() {
        // connect
        $m = self::getMongoClient();

        // select a database
        $db = $m->wiktionary;

        // select a collection (analogous to a relational database's table)
        $collection = $db->wikiwords;

        return $collection;
    }
}


class WikiXMLReader {

    public $lang;
    protected $fp = null;       // file pointer
    protected $colOldWikiWords;


    public function __construct($filename) {
        $this->fp = fopen($filename, 'r');

        $fp = $this->fp;

        $line = fgets($fp);
        if (!preg_match('/lang="(.*?)"/', $line, $matches)) {
            throw new Exception('Unable to open file and get language.');
        }

        $this->lang = $matches[1];

        $this->colOldWikiWords = WiktionaryDB::getOldMongoCollection();
    }

    public function __destruct() {
        fclose($this->fp);
    }

    /**
     * @param $fp       file pointer
     * @param $regex    regex to match
     * @return string the line that matched.
     */
    static function skipLinesUntil($fp, $regex) {
        $line = fgets($fp);

        while ($line !== false && !preg_match($regex, $line)) {
            $line = fgets($fp);
        }

        return $line;
    }

    /**
     * @param $fp
     * @param $regex
     * @return array    return an array of lines including the matching one.
     */
    static function collectLinesUntil($fp, $regex) {
        $lines = array();

        $line = fgets($fp);
        $lines[] = $line;

        while ($line !== false && !preg_match($regex, $line)) {
            $line = fgets($fp);
            $lines[] = $line;
        }

        return $lines;
    }


    static function readPageSection($fp) {
        $section = '';

        $firstLineOfPageSection = self::skipLinesUntil($fp, '/<page>/');
        if ($firstLineOfPageSection) {
            $lines = self::collectLinesUntil($fp, '/<\/page>/');
            $section = $firstLineOfPageSection . implode('', $lines);
        }

        return $section;
    }


    public function extractNextPage() {
        if (empty($this->fp)) {
            return null;
        }

        $page = $this->readPageSection($this->fp);
        // echo $page . "\n";
        if (empty($page)) {
            return null;
        }
        $p = simplexml_load_string($page);
        $p->lang = $this->lang;
        return $p;
    }
}

function shouldStorePage($page, $colOldWikiWords) {
    $process = false;
    $text = $page->revision->text;
    switch ($page->lang) {
        case 'nl':
            $process = substr($text, 0, 9) == '{{=nld=}}';
            break;
        case 'de':
            $t0 = strpos($text, '{{Sprache|');
            $t1 = strpos($text, '{{Sprache|Deutsch}}');
            $process = ($t0 == $t1) && $t1 !== false;
            break;
        case 'fr':
            //$t0 = strpos($text, '{{langue|');
            $t1 = strpos($text, '{{langue|fr}}');
            $process = $t1 !== false;
            break;
        case 'en':
            $t0 = strpos($text, '==');
            $t1 = strpos($text, '==English==');
            $process = ($t0 == $t1) && $t1 !== false;
            break;
        case 'es':
            $t0 = strpos($text, '{{');
            $t1 = strpos($text, '{{ES|');
            $process = ($t0 == $t1) && $t1 !== false;
            break;
        case 'sv':
            $t0 = strpos($text, '==');
            $t1 = strpos($text, '==Svenska==');
            $process = ($t0 == $t1) && $t1 !== false;
            break;
    }

    /*
    if (!$process) {
        $n = $colOldWikiWords->find(array('lang'=>$page->lang, 'title'=>$page->title))->count();
        $process = $n > 0;

    }
    */

    return $process;
}

function processXmlFile($filename) {
    $reader = new WikiXMLReader($filename);
    $collection = WiktionaryDB::getMongoCollection();
    $colOldWikiWords = WiktionaryDB::getOldMongoCollection();

    while (($page = $reader->extractNextPage()) && !empty($page)) {
        $page = json_decode(json_encode($page));
        $ns = $page->ns;
        if ($ns == 0 && shouldStorePage($page, $colOldWikiWords)) {
            echo $page->id, ': ',$page->title;
            $collection->update(array('lang'=>(string)$page->lang,'id'=>(string)$page->id), array('$set'=>$page), array('upsert'=>true));
            $e = $collection->db->lastError();
            echo " n: {$e['n']}; updated: ".($e['n'] && $e['updatedExisting'] ? 'true':'false')." .\n";
        }
    }

}


$args = Tools::parseArgs($argv);

if (!isset($args[1]) && !file_exists($args[1])) {
    echo "\nusage: php ".  basename(__FILE__) ." xmlfilename\n";
    exit;
}

$filename = $args[1];

$pinfo = pathinfo($filename);

if ($pinfo['extension'] != 'xml') {
    $filename = 'compress.bzip2://'.$filename;
 }

processXmlFile($filename);


echo "\nDone\n";
