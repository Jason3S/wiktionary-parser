<?php 
// api.php

header('Content-Type: application/json; charset=utf-8'); 


function GetPostVariable($name, $default = false)
{
    if (isset($_POST[$name])) 
        return $_POST[$name];

    if (isset($_GET[$name])) 
        return $_GET[$name];
    
    return $default;
}


function search()
{
    $q = GetPostVariable('q', '');
    $lang = GetPostVariable('lang', '');

    $result = array();

    if ($q !== '' && $lang != '')
    {
        // connect
        $m = new MongoClient();

        // select a database
        $db = $m->wiktionary;

        // select a collection (analogous to a relational database's table)
        $collection = $db->pages;

        $request = array('lang'=>$lang, 'title'=>$q);

        return $collection->findOne($request);

    }

    return $result;
}


$action = GetPostVariable('action');
$result = array();



switch ($action) {
    case 'search':
        $result = search();
        break;
    
    default:
        # code...
        break;
}

echo json_encode($result);

?>