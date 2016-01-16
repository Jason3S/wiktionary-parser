/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import React = require('react');
import ReactDOM = require('react-dom');
import * as _ from 'lodash';
import jQuery = require('jquery');

class TreeNode extends React.Component<IAstProps, IAstState> {

    constructor(props : IAstProps){
        super(props);
        this.state = { showChildren: false };
    }


    public render() {

        var model:IAstModel = this.props.model || {t:''};
        var hasChildren = model.c && model.c.length;
        var children = hasChildren && model.c
            ? model.c.map((node: IAstModel, index: number)=>{ return (<TreeNode key={index} model={node} />);})
            : null;
        var nodeValue = model.v || '';
        if (hasChildren) {
            return (
                <div className="treeNode" >
                    <label><input type="checkbox" onChange={()=>{this.toggleShowChildren();}}/> {this.props.model.t}</label>
                    <div className={this.state.showChildren ? 'show':'hidden'} >
                        {children}
                    </div>
                </div>
            );
        }
        return (
            <div className="treeNode" >
                <b><i>{nodeValue.toString()}</i></b>
            </div>
        );
    }

    public toggleShowChildren() {
        this.setState({showChildren: !this.state.showChildren});
    }
}

export { TreeNode };
