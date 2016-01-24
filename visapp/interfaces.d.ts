/**
 * Created by jasondent on 16/01/2016.
 */

/// <reference path="../node_modules/immutable/dist/immutable.d.ts"/>

declare type AstValue = string|number|boolean;

interface IAstModel {
    t: string;                  // type
    c?: IAstModel[];            // children
    v?: AstValue;               // value
}

interface IAstTree extends IAstModel {
    c?: IAstTree[];
}

interface IAstQuery {
    lang: string;
    word: string;
    site?: string;
}

interface IAstProps {
    key? : string|number;
    query: IAstQuery;
    model : IAstModel;
}

interface IAstState {
    showChildren? : boolean;
}

interface IEmptyState {}

interface IAstCacheItem {
    ast: IAstModel;
    query: IAstQuery;
}

interface IAstCache {
    [index:string]: IAstCacheItem;
}
