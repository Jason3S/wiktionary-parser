/// <reference path="../node_modules/rx/ts/rx.all.d.ts" />
/// <reference path="./interfaces.d.ts" />

declare module 'react-dnd-html5-backend' {
    export interface HTML5Backend {}
}

interface Window {
    devToolsExtension(): any;
}

declare module 'isomorphic-fetch' {
    export = fetch;
}

/* tslint:disable:no-internal-module */
declare module Redux {
    export function createStore(reducer: Reducer, initialState?: any, enhancer?: Function): Store;
}
/* tslint:enable:no-internal-module */

declare module 'JSONSelect' {
    type Callback = (value: any) => any;

    interface JsonSelectInstance {
        match(obj: any): any[];
        foreach(obj: any, fn: Callback): void;
    }

    interface JsonSelect {
        match(select: string, json: any): any[];
        match(select: string, args: string[], json: any): any[];
        foreach(select: string, json: any, callback: Callback): any[];
        foreach(select: string, args: string[], json: any, callback: Callback): any[];
        compile(select: string, json: any): JsonSelectInstance;
        compile(select: string, args: string[], json: any): JsonSelectInstance;
    }

    const jsonSelect: JsonSelect;
    export = jsonSelect;
}