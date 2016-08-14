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

