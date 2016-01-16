/**
 * Created by jasondent on 16/01/2016.
 */


interface IAstModel {
    t: string;                  // type
    c?: IAstModel[];            // children
    v?: string|number|boolean;  // value
}


interface IAstProps {
    model : IAstModel;
}


interface IAstState {
    showChildren? : boolean;
}

interface IAppProps {
    model : IAstModel;
}

interface IAppState {
    editing? : string;
    nowShowing? : string
}
