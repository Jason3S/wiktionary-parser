/**
 * Created by jasondent on 16/01/2016.
 */

import * as React from 'react';
import ReactDOM = require('react-dom');
import { AstViewer } from './components/astViewer';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { reducers } from './reducers/visapp';
import Redux = require('redux');
import * as reduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import _ = require('lodash');
import createStore = Redux.createStore;
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import { observableFromStore } from 'redux-rx';
import { changePage, requestPage } from './actions/Actions';

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

const reducer = Redux.combineReducers(_.assign(
    {},
    reducers,
    { routing: routerReducer }
));

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

observableFromStore(store)
    .map((state: ApplicationState) => state.currentPage)
    .scan((prevState, state) => {
        if (prevState !== state) {
            // store.dispatch(changePage(state));
            console.log(state);
        }
        return state;
    }, null)
    .subscribe(() => {});

const history = syncHistoryWithStore(browserHistory, store);


function AppRootRoute(props: AstAppProps) {
    return (<div></div>);
}

function AppContent(props: any) {
    return (
        <div>
            <h1>Content</h1>
            <AstViewer {...props} />
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

