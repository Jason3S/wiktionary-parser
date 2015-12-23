// modulelib.js

/*
// This is a helper library for to allow for files to be used both by node.js and in the browser.
*/

(function(){
    "use strict";

    var modules = {};

    function Module(name)
    {
        this.id = name;
        this.exports = {};
    }

    function require(name)
    {
        if (!modules.hasOwnProperty(name))
        {
            throw('Unknon Module: '+name);
        }

        return modules[name].exports;

    }

    function declareModule(name)
    {
        if (modules.hasOwnProperty(name))
        {
            throw('Module redeclarition: ' + name);
        }

        window.module = modules[name] = new Module(name);

        window.exports = window.module.exports;
    }

    window.require = require;
    window.declareModule = declareModule;
}());

