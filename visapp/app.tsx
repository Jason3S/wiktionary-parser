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


interface IAstAppProps {
    params?: IAstQuery;
}

class AstApp extends React.Component<IAstAppProps, {}> {

    constructor(props) {
        super(props);
    }

    render() {
        const { lang, word } = this.props.params;
        let defaultLang = 'en';
        let defaultWord = 'walk';
        return (
            <AstViewer lang={lang||defaultLang} word={word||defaultWord}/>
        );
    }
}


function render() {
    ReactDOM.render((
            <Router history={browserHistory}>
                <Route path="/(:lang/:word)" component={AstApp}>
                </Route>
            </Router>
        ),
        document.getElementById('content-container')
    );
}

render();

