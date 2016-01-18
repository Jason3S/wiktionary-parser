/**
 * Created by jasondent on 16/01/2016.
 */


declare type AstValue = string|number|boolean;

interface IAstModel {
    t: string;                  // type
    c?: IAstModel[];            // children
    v?: AstValue;               // value
}


interface IAstQuery {
    lang: string;
    word: string;
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

