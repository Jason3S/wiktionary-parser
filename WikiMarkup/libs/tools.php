<?php
/**
 * Created by PhpStorm.
 * User: jason
 * Date: 1/23/14
 * Time: 07:31 AM
 */


class Tools {

    public static function parseArgs($argv) {
        $args = array();

        foreach ($argv as $key => $value)
        {
            $args[$key] = $value;
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

        return $args;
    }

    public static function ifsetor($array, $key, $default) {
        return (isset($array[$key])) ? $array[$key] : $default;
    }
}

