/**
 * Created by jasondent on 16/01/2016.
 */


declare type AstValue = string|number|boolean;

interface IAstModel {
    t: string;                  // type
    c?: IAstModel[];            // children
    v?: AstValue;               // value
}


interface IAstProps {
    key? : string|number;
    model : IAstModel;
}

interface IAstState {
    showChildren? : boolean;
}

interface IEmptyState {}

interface IAppProps {
    model : IAstModel;
}

interface IAppState {
    editing? : string;
    nowShowing? : string
}
