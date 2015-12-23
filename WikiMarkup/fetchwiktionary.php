<?php


function array2urlquery($a)
{
    $urlParts = array();
    foreach ($a as $key => $value) {
        $urlParts[] = rawurlencode($key).'='.rawurlencode($value);
    }

    return implode('&', $urlParts);
}


function getWikiWords($lang, $wordlist)
{
    $ch = curl_init();

    if (is_array($wordlist))
    {
        $wordlist = implode('|', $wordlist);
    }

    $data = array(
        'action' => 'query',
        'prop' => 'revisions|info',
        'rvprop' => 'content',
        'format' => 'json',
        'titles' => $wordlist
    );

    curl_setopt($ch, CURLOPT_URL, 'http://' . $lang .'.wiktionary.org/w/api.php?'.array2urlquery($data));
    curl_setopt($ch, CURLOPT_USERAGENT, 'Wiki Reader -- info@streetsidesoftware.nl');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $server_output = curl_exec ($ch);

    curl_close ($ch);

    return $server_output;
}


function requestWikiWords($lang, $wordlist)
{
    $json = getWikiWords($lang, $wordlist);

    $data = json_decode($json);

    $pages = array();

    if (!empty($data) && !empty($data->query) && !empty($data->query->pages))
    {
        $pages = $data->query->pages;
    }

    return $pages;
}


// requestWikiWords('en', array('plane','train'));


?>