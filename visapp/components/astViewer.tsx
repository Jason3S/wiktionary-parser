/**
 * Created by jasondent on 16/01/2016.
 */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./../interfaces.d.ts"/>

import React = require('react');
import ReactDOM = require('react-dom');
import * as _ from 'lodash';
import jQuery = require('jquery');
import wikiParser = require('../../lib/wiki-parser');
import { TreeNode } from "./treeNode";
import { AstDocView } from "./astDocView";
import { IWiktionaryQueryResult } from "../../lib/wiktionary/wiktionary-reader";

interface IAstViewerState {
    tree: IAstModel;
}

interface IAstViewerProps {
    lang: string;
    word: string;
}


class AstViewer extends React.Component<IAstViewerProps, IAstViewerState> {

    static defaultState : IAstViewerState = { tree: {t:'root'} };

    constructor(props : IAstViewerProps) {
        super(props);
        this.state = AstViewer.defaultState;
        this.fetchTree(props.lang, props.word);
    }

    fetchTree(lang: string, word: string) {

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

        var request = {
            url: url,
            dataType: 'jsonp',
            crossDomain: true
        };

        jQuery.ajax(request).then((result: IWiktionaryQueryResult)=>{
            let pages = _(result.query.pages)
                .filter((p)=>{ return p.title == word && p.pagelanguage==lang;})
                .map((p:any)=>{ return p.revisions; })
                .filter((p)=>{ return p; })
                .map((p:any)=>{ return p[0]; })
                .filter((p)=>{ return p; })
                .map((p:any)=>{ return p['*'];})
                .filter((p)=>{ return p; })
                .value();
            pages = pages || [];
            let markup = pages[0] || '';
            let tree;
            try {
                tree = wikiParser.parse(markup);
            } catch (e) {
                tree = {t: 'parse-error', v: e.message};
            }
            this.setState({ tree: tree });
        });
    }

    componentWillReceiveProps(newProps : IAstViewerProps) {
        const { props } = this;
        const isChanged = props.lang != newProps.lang || props.word != newProps.word;
        if (isChanged) {
            this.setState(AstViewer.defaultState);
            this.fetchTree(newProps.lang, newProps.word);
        }
    }

    render() {
        const { lang, word } = this.props;
        return ((
            <div>
                <div className="row">
                    <div className="col-md-12">
                        Language: {lang}, Word: {word}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 ast-tree-view">Wiki AST
                        <TreeNode model={this.state.tree} query={this.props}/>
                    </div>
                    <div className="col-md-8 ast-doc-view">Document:
                        <AstDocView model={this.state.tree} query={this.props}/>
                    </div>
                </div>
            </div>
        ));
    }
}

export { AstViewer, IAstViewerState, IAstViewerProps };
