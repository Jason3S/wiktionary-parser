
/* tslint:disable:no-unused-variable */
// Required for JSX to compile
import React = require('react');
/* tslint:enable:no-unused-variable */
import createFragment = require('react-addons-create-fragment');


type Children = JSX.Element | JSX.Element[];

interface BaseProps {
    children?: Children;
}

interface AstViewProps extends AstProps {}

interface ModelProperties extends AstViewProps {
    value: AstValue;
    children: AstModel[];
}


type RenderFunction = (props: AstViewProps) => React.ReactNode;

interface RenderDictionary {
    [index: string]: RenderFunction;
}

const renderFunctions: RenderDictionary = {
};

type RenderResultSingle = React.ReactElement<any> | string | boolean | number;
type RenderResult = RenderResultSingle | RenderResultSingle[];

function defaultRenderFn(props: AstViewProps): React.ReactNode {
    const { model, query } = props;
    if (model.v !== undefined) {
        return (<span key={model.id}>{model.v}</span>);
    }

    const children = (model.c || []).map(m => m ? RenderNode({query, model: m}) : null);

    return (
        <div key={model.id} className={'ast-' + model.t} >
            <b><i>{model.t}</i></b>
            <div>
                {children}
            </div>
        </div>
    );
}

function RenderNode(props: AstViewProps): JSX.Element {

    const { model, query } = props;
    if (model.v !== undefined) {
        return (<span key={model.id}>{model.v}</span>);
    }

    const children = (model.c || []).map(m => m ? RenderNode({query, model: m}) : null);

    return (
        <div key={model.id} className={'ast-' + model.t} >
            <b><i>{model.t}</i></b>
            <div>
                {children}
            </div>
        </div>
    );
}

function AstDocView(props: AstProps) {
    return (
        <div className="docView" >
            <b><i>Doc View</i></b><br/>
            <RenderNode {...props}/>
        </div>
    );
}

export { AstDocView };

function NodeText(props: BaseProps): JSX.Element {
    return props.children
        ? (<div style="display: inline-block">{props.children}</div>)
        : null;
}

