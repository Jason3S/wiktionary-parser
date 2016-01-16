/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import React = require('react');
import ReactDOM = require('react-dom');
import * as _ from 'lodash';
import jQuery = require('jquery');


class GenericNode extends React.Component<IAstProps, IAstState> {

}


class AstDocView extends React.Component<IAstProps, IAstState> {

    constructor(props : IAstProps){
        super(props);
        this.state = { showChildren: false };
    }

    public render() {
        return (
            <div className="docView" >
                <b><i>Doc View</i></b>
            </div>
        );
    }
}

export { AstDocView };
