/**
 * Created by jasondent on 16/01/2016.
 */

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import React = require('react');
import ReactDOM = require('react-dom');
import * as _ from 'lodash';
import jQuery = require('jquery');
import wikiParser = require('../lib/wiki-parser');
import Dictionary = _.Dictionary;
import { TreeNode } from "./treeNode";
import { AstDocView } from "./astDocView";


var tree: IAstModel = {t:'root'};


function render() {
    ReactDOM.render(
        <div>Wiki AST <TreeNode model={tree}/></div>,
        document.getElementsByClassName('ast-tree-view')[0]
    );
    ReactDOM.render(
        <div>Document: <AstDocView model={tree}/></div>,
        document.getElementsByClassName('ast-doc-view')[0]
    );
}

function fetchTree(lang: string, word: string) {

    var params:Dictionary<string> = {
        action : 'query',
        prop :   'revisions|info',
        rvprop : 'content',
        format : 'json',
        titles : word
    };

    var uri = 'https://' + lang + '.wiktionary.org/w/api.php?';

    var url = uri + _
            .map(params,function(value:string, key:string){ return encodeURIComponent(key) + '=' + encodeURIComponent(value); })
            .join('&');

    jQuery.ajax({
        url: url,
        dataType: 'jsonp',
        crossDomain: true
    }).then((result)=>{
        var pages = _(result.query.pages)
            .filter((p)=>{ return p.title == word && p.pagelanguage==lang;})
            .map((p:any)=>{ return p.revisions; })
            .filter((p)=>{ return p; })
            .map((p:any)=>{ return p[0]; })
            .filter((p)=>{ return p; })
            .map((p:any)=>{ return p['*'];})
            .filter((p)=>{ return p; })
            .value();
        pages = pages || [];
        var markup = pages[0] || '';
        tree = wikiParser.parse(markup);
        render();
    });
}

render();

fetchTree('en', 'house');