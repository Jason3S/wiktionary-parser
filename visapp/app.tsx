/**
 * Created by jasondent on 16/01/2016.
 */

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import Immutable = require('immutable');
import React = require('react');
import ReactDOM = require('react-dom');
import { AstViewer, IAstViewerProps } from './components/astViewer';
import { browserHistory, Router, Route, Link } from 'react-router';
import { visApp } from './reducers/visapp';
import Rx = require('rx');
import Redux = require('redux');

let store = Redux.createStore(visApp);

interface IAstAppProps {
    params?: IAstQuery;
}

class AstApp extends React.Component<IAstAppProps, {}> {
    render() {
        const { lang, word } = this.props.params;
        let defaultLang = 'en';
        let defaultWord = 'walk';
        return (
            <AstViewer lang={lang||defaultLang} word={word||defaultWord}/>
        );
    }
}

class AppPageRequest extends React.Component<IAstAppProps, {}> {
    render() {
        const { lang, word } = this.props.params;
        console.log(this.props);
        return <AstApp params={{lang, word}}/>;
    }
}


function render() {
    ReactDOM.render((
            <Router history={browserHistory}>
                <Route path="/(:lang/:word)" component={AppPageRequest}>
                </Route>
            </Router>
        ),
        document.getElementById('content-container')
    );
}

render();

/*
import { fetchWikiMarkup } from './lib/WikiApi';

var observable = fetchWikiMarkup('en', 'hello', 'wiktionary.org');

export var result = '';

observable.subscribe((markup)=>{result = markup;});
*/


