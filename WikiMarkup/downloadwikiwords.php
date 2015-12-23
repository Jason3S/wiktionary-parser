<?php 

require_once('fetchwiktionary.php');

// downloadwikiwords.php

// connect
$m = new MongoClient();

// select a database
$db = $m->wiktionary;

// select a collection (analogous to a relational database's table)
$collection = $db->wikiwords;


// Open the control file.


// language map.
$lang2Code = array('','nl','en','de','fr','es','sv');

$startlang = 'en';
$offset = 0;

$args = array();

foreach ($argv as $key => $value) 
{
    $parts = explode('=', $value);
    if (count($parts) > 1)
    {
        $args[$parts[0]] = $parts[1];
    }
    else
    {
        $args[$parts[0]] = true;
    }
}

if (array_key_exists('lang', $args))
{
    $startlang = $args['lang'];
}

if (array_key_exists('offset', $args))
{
    $offset = $args['offset'];
}

// Open the word list file
$row = 1;
if (($handle = fopen("words_16.csv", "r")) !== FALSE) {

    $columnNames = fgetcsv($handle, 4000, ",");

    $mapColumns = array();
    foreach ($columnNames as $key => $value) {
        $mapColumns[$value] = $key;
    }

    $n = 0;

    while (($rowvalues = fgetcsv($handle, 4000, ",")) !== FALSE) {
        
        $row = array();
        foreach ($rowvalues as $key => $value) {
            $row[$columnNames[$key]] = $value;
        }

        $lang = $lang2Code[$row['lang']];
        if ($lang == $startlang && $row['wordnr'] > $offset)
        {
            echo 'Fetch: ';
            foreach ($row as $key => $value) {
                echo $key,': "', $value, '", ';
            }
            echo "\n";

            $word = $row['word'];
            $pages = requestWikiWords($lang, $word);

            foreach ($pages as $key => $value) {
                $value->lang = $lang;
                $value->word = $word;
                $value->wordnr = $row['wordnr'];
                echo json_encode($value);
                // $collection->insert($value);
                $collection->update(array('lang'=>$lang,'title'=>$word), array('$set'=>$value), array('upsert'=>true));
            }
            echo ".Done.\n";

            ++$n;
        }

        if (0 && $n > 1)
            break;

    }
    fclose($handle);
}


?>