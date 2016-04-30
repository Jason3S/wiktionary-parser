/**
 * Created by jasondent on 16/01/2016.
 */

/// <reference path="../node_modules/immutable/dist/immutable.d.ts"/>

declare type AstValue = string|number|boolean;

interface AstModel {
    id: number;                 // unique id within the tree
    t?: string;                 // type
    c?: AstModel[];             // children
    v?: AstValue;               // value
}

interface AstTree extends AstModel {
    c?: AstTree[];
}

interface AstQuery {
    lang: string;
    page: string;
    site?: string;
}

interface AstProps {
    key?: string|number;
    query: AstQuery;
    model: AstModel;
}

interface AstState {
    showChildren?: boolean;
}

interface EmptyState {}

interface AstCacheItem {
    ast: AstModel;
    query: AstQuery;
}

interface AstCache {
    [index: string]: AstCacheItem;
}


interface ApplicationState {
    currentPage: AstQuery;
    ast: AstModel;
    cache: AstCache;
}


interface Window {
    devToolsExtension(): any;
}
