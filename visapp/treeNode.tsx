/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import React = require('react');
import ReactDOM = require('react-dom');
import * as _ from 'lodash';
import jQuery = require('jquery');


class TreeNode extends React.Component<IAstProps, IAstState> {

    constructor(props : IAstProps){
        super(props);
        const { model } = props;
        this.state = { showChildren: true };
    }


    public render() {
        var props = this.props;
        var model:IAstModel = props.model || {t:''};
        var hasChildren = model.c && model.c.length;
        var children = hasChildren && model.c
            ? model.c.map((node: IAstModel, index: number)=>{ return (<TreeNode key={index} model={node} query={props.query} />);})
            : null;
        var nodeValue = model.v || '';
        if (hasChildren) {
            return (
                <div className="treeNode" >
                    <label><input type="checkbox" onChange={()=>{this.toggleShowChildren();}}/> {model.t}</label>
                    <div className={this.state.showChildren ? 'show':'hidden'} >
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
