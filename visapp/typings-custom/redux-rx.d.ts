declare module 'redux-rx' {
    import * as Redux from 'redux';
    import * as Rx from 'rx';

    export function observableFromStore<S>(store: Redux.Store): Rx.Observable<S>;
    export const observableMiddleware: Redux.Middleware;
}
