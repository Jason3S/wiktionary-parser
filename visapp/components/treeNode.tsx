
/* tslint:disable:no-unused-variable */
// Required for JSX to compile
import React = require('react');
/* tslint:enable:no-unused-variable */

function TreeNode(props: AstProps) {
        const model: AstModel = props.model || {id: -1, t: ''};
        const hasChildren = model.c && model.c.length;
        const children = hasChildren
            ? model.c.map((node: AstModel, index: number) => <TreeNode key={index} model={node} query={props.query} />)
            : null;
        const nodeValue = model.v || '';
        if (children) {
            return (
                <div className="treeNode" >
                    <b>{model.t}</b>
                    <div className="show" >
                        {children}
                    </div>
                </div>
            );
        }
        return (
            <div className="treeNode" >
                <b>{model.t}: </b>
                <i>{nodeValue.toString().substr(0, 50)}</i>
            </div>
        );
}

export { TreeNode };
