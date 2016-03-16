/**
 * Created by jasondent on 16/01/2016.
 */

import React = require('react');
import ReactDOM = require('react-dom');
// import { AstViewer, IAstViewerProps } from './components/astViewer';
import { createHistory, useBasename } from 'history';
import { Router, Route /*, Link */ } from 'react-router';
import { syncHistory, routeReducer } from 'react-router-redux';
import { reducers } from './reducers/visapp';
import Redux = require('redux');
import { Provider } from 'react-redux';
import {requestPage} from './actions/Actions';
import _ = require('lodash');
import applyMiddleware = Redux.applyMiddleware;
import createStore = Redux.createStore;
import compose = Redux.compose;


interface IAstAppProps {
    params?: IAstQuery;
    location: {
        query: {
            lang?: string;
            page?: string;
            site?: string;
        };
    };
}

/*
class AstApp extends React.Component<IAstAppProps, {}> {
    render() {
        const { lang, word } = this.props.params;
        const appState = requestPage(lang, word);
        return (
            <AstViewer appState={appState}/>
        );
    }
}

function appRender() {
    const {lang, word} = applicationState.currentPage;
    ReactDOM.render((
            <AstApp params={{lang, word}} />
        ),
        document.getElementById('content-container')
    );
}

class AppPageRequest extends React.Component<IAstAppProps, {}> {
    render() {
        const defaultLang = 'en';
        const defaultWord = 'walk';
        const { lang, word } = this.props.params;
        const appState = requestPage(lang||defaultLang, word||defaultWord);
        console.log(this.props);
        window.setTimeout(appRender, 0);
        return null;
    }
}
*/

/*
function setupRouter() {
    ReactDOM.render((
            <Router history={browserHistory}>
                <Route path="/(:lang/:word)" component={AppPageRequest}>
                </Route>
            </Router>
        ),
        document.getElementById('router')
    );
}
*/

const reducer = Redux.combineReducers(_.assign({}, reducers, {
    routing: routeReducer
}));

const history = useBasename(createHistory)({
    basename: '/'
});

// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(history);
const createStoreWithMiddleware = compose(
    applyMiddleware(reduxRouterMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = createStoreWithMiddleware(reducer);

// Required for replaying actions from devtools to work
reduxRouterMiddleware.listenForReplays(store);

class AppPageRequest extends React.Component<IAstAppProps, {}> {
    render() {
        const { lang, page, site } = this.props.location.query;
        return (<div>
            Lang: '{lang}', Word: '{page}', Site: '{site}'
        </div>);
    }
}

function render() {
    const rootElement = document.getElementById('content-container');
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                <Route path="/" component={AppPageRequest}>
                </Route>
            </Router>
        </Provider>,
        rootElement
    );
}

// Link the renderer to the store.
store.subscribe(render);
// Force the initial state and cause a render to happen.
store.dispatch(requestPage({lang: 'en', page: 'walk', site: 'wiktionary.org'}));
