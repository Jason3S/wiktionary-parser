/**
 * Created by jasondent on 16/01/2016.
 */

import React = require('react');
import ReactDOM = require('react-dom');
// import { AstViewer, IAstViewerProps } from './components/astViewer';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { reducers } from './reducers/visapp';
import Redux = require('redux');
import * as reduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import {requestPage} from './actions/Actions';
import _ = require('lodash');
import applyMiddleware = Redux.applyMiddleware;
import createStore = Redux.createStore;
import compose = Redux.compose;
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

const thunkMiddleware = reduxThunk.default;

interface AstAppProps {
    params?: AstQuery;
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

/*
// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(history);
const createStoreWithMiddleware = compose(
    applyMiddleware(thunkMiddleware, reduxRouterMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

// Required for replaying actions from devtools to work
reduxRouterMiddleware.listenForReplays(store);

const store = createStoreWithMiddleware(reducer);

const history = useBasename(createHistory)({
    basename: '/'
});

*/


const reducer = Redux.combineReducers(_.assign({}, reducers, {
  routing: routerReducer
}));

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <LogMonitor theme="tomorrow" preserveScrollTop={false} />
  </DockMonitor>
);

const store = createStore(
    reducer,
    Redux.compose(
        Redux.applyMiddleware(
            thunkMiddleware
        ),
        DevTools.instrument()
    )
);

const history = syncHistoryWithStore(browserHistory, store);


function AppRootRoute(props: AstAppProps) {
    return (<div></div>);
}

function AppContent(props: any) {
    return (
        <div>
            <h1>Content</h1>
            <br/>
            {JSON.stringify(props, (_, v) => v, 2)}
        </div>
    );
}

function bindRequests() {
    return (dispatch) => null;
}

store.dispatch(bindRequests());

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={history}>
        <Route path="/" component={AppRootRoute}>
        </Route>
      </Router>
      <AppContent {...store.getState()} />
      <DevTools />
    </div>
  </Provider>,
  document.getElementById('content-container')
);

// Force the initial state and cause a render to happen.
store.dispatch(requestPage({lang: 'en', page: 'walk', site: 'wiktionary.org'}));
