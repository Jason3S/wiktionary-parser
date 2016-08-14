
/* tslint:disable:no-unused-variable */
// Required for JSX to compile
import React = require('react');
/* tslint:enable:no-unused-variable */

interface AstViewProps extends AstProps {}

interface ModelProperties extends AstViewProps {
    value: AstValue;
    children: AstModel[];
}



function RenderNode(props: AstViewProps) {

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
