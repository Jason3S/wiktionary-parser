/**
 * Created by jasondent on 16/01/2016.
 */

/* tslint:disable:no-unused-variable */
// Required for JSX to compile
import React = require('react');
/* tslint:enable:no-unused-variable */
import ReactDOM = require('react-dom');
import { AstViewer } from './components/astViewer';
import { reducers } from './reducers/visapp';
import * as Redux from 'redux';
import * as reduxThunk from 'redux-thunk';
import _ = require('lodash');
import createStore = Redux.createStore;
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import { observableFromStore } from 'redux-rx';
import { requestWikiPage, changePage } from './actions/Actions';
import {requestPageAync} from './async-actions/AsyncActions';

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

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <LogMonitor theme="tomorrow" preserveScrollTop={false} />
  </DockMonitor>
);

const store = createStore(
    reducers,
    Redux.compose(
        Redux.applyMiddleware(
            thunkMiddleware
        ),
        DevTools.instrument()
    )
);

observableFromStore(store)
    .debounce(100)
    .map((state: ApplicationState) => state.currentPage)
    .scan((prevState, state) => {
        if (! _.isEqual(prevState, state)) {
            store.dispatch(requestPageAync(requestWikiPage(state)));
            console.log(state);
        }
        return state;
    }, null)
    .subscribe(() => {});

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

store.subscribe(render);
store.dispatch(bindRequests());
store.dispatch(changePage({lang: 'en', page: 'slide'}));


function render() {
    ReactDOM.render(
    <div>
        <AppContent {...store.getState()} />
        <DevTools store={store} />
    </div>,
    document.getElementById('content-container')
    );
}


