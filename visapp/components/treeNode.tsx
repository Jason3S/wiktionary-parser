
import React = require('react');


class TreeNode extends React.Component<AstProps, AstState> {

    constructor(props: AstProps) {
        super(props);
        this.state = { showChildren: true };
    }

    public render() {
        const props = this.props;
        const model: AstModel = props.model || {t: ''};
        const hasChildren = model.c && model.c.length;
        const children = hasChildren && model.c
            ? model.c.map((node: AstModel, index: number) => <TreeNode key={index} model={node} query={props.query} />)
            : null;
        const nodeValue = model.v || '';
        if (hasChildren) {
            return (
                <div className="treeNode" >
                    <label><input type="checkbox" onChange={() => {this.toggleShowChildren();}}/> {model.t}</label>
                    <div className={this.state.showChildren ? 'show' : 'hidden'} >
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

    public toggleShowChildren() {
        this.setState({showChildren: !this.state.showChildren});
    }
}

export { TreeNode };
