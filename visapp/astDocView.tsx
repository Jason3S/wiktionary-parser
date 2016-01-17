/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import React = require('react');
import ReactDOM = require('react-dom');
import * as _ from 'lodash';
import jQuery = require('jquery');

interface IAstViewProps extends IAstProps {}

type NodeViewConstructor = new(...params:any[])=>BaseNodeView;
var mapTypeToViewNodes:Dictionary<NodeViewConstructor> = {};

function registerMap(conFn: NodeViewConstructor, relevantTypes:string[]) {
    var map = _.forEach(relevantTypes, (type:string)=>{ mapTypeToViewNodes[type] = conFn; });
    return true;
}


class BaseNodeView extends React.Component<IAstViewProps, IEmptyState> {

    public static renderChildren(children : IAstModel[]) : React.ReactElement<IAstViewProps>|React.ReactElement<IAstViewProps>[] {
        if (children.length) {
            return (children.map((model:IAstModel, key:number)=>{ return BaseNodeView.renderChild(key, model); }));
        }
        return (<span>{"{{empty}}"}</span>);
    }

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        if (value !== undefined) {
            return (
                <span>{value}</span>
            );
        }

        return (
            <div className="docView" >
                <b><i>{model.t}</i></b>
                <div>
                    {BaseNodeView.renderChildren(children)}
                </div>
            </div>
        );
    }

    public render() {
        var model = this.props.model;
        var value = model.v;
        var children = model.c || [];
        return this.renderModel(model, value, children);
    }

    protected static renderChild(key: string|number, model:IAstModel) {
        if (model) {
            var viewClassConstructor = mapTypeToViewNodes[model.t] || BaseNodeView;
            return React.createElement(viewClassConstructor, {key: key, model:model});
        }
        return (<span>{"{{null}}"}</span>);
    }
}

class RootNodeView extends BaseNodeView {}


class RenderChildren extends BaseNodeView {
    static registered = registerMap(RenderChildren, [
        'article', 'paragraph', 'paragraphs', 'sections', 'line-of-text', 'lines-of-text', 'wiki-page',
        'section1', 'section2', 'section3', 'section4', 'section5'
    ]);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<div className={'ast-'+model.t}>{BaseNodeView.renderChildren(children)}</div>);
    }
}

class RenderSectionContent extends BaseNodeView {
    static registered = registerMap(RenderSectionContent, [
        'section1-content', 'section2-content', 'section3-content', 'section4-content', 'section5-content'
    ]);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<div className={'ast-'+model.t+' treeNode'}>{BaseNodeView.renderChildren(children)}</div>);
    }
}

class RenderOrderedList extends BaseNodeView {
    static registered = registerMap(RenderOrderedList, ['ordered-list']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<ol className={'ast-'+model.t}>{BaseNodeView.renderChildren(children)}</ol>);
    }
}

class RenderUnorderedList extends BaseNodeView {
    static registered = registerMap(RenderUnorderedList, ['unordered-list']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<ul className={'ast-'+model.t}>{BaseNodeView.renderChildren(children)}</ul>);
    }
}

class RenderIndentedList extends BaseNodeView {
    static registered = registerMap(RenderIndentedList, ['indented-list']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<ul className={'ast-'+model.t + ' indented-list'}>{BaseNodeView.renderChildren(children)}</ul>);
    }
}

class RenderListItem extends BaseNodeView {
    static registered = registerMap(RenderListItem, ['list-item']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<li className={'ast-'+model.t}>{BaseNodeView.renderChildren(children)}</li>);
    }
}

class RenderSpan extends BaseNodeView {
    static registered = registerMap(RenderSpan, ['text', 'template-name', 'template-param']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<span className={'ast-'+model.t}>{BaseNodeView.renderChildren(children)}</span>);
    }
}

class RenderBold extends BaseNodeView {
    static registered = registerMap(RenderBold, ['bold-text']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<b className={'ast-'+model.t}>{BaseNodeView.renderChildren(children)}</b>);
    }
}

class RenderItalic extends BaseNodeView {
    static registered = registerMap(RenderItalic, ['italic-text']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<i className={'ast-'+model.t}>{BaseNodeView.renderChildren(children)}</i>);
    }
}

class RenderTemplateParam extends BaseNodeView {
    static registered = registerMap(RenderTemplateParam, ['template-param']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<span className={'ast-'+model.t}>|{BaseNodeView.renderChildren(children)}</span>);
    }
}

class RenderSectionTitle extends BaseNodeView {
    static registered = registerMap(RenderSectionTitle, [
        'section1-title', 'section2-title', 'section3-title', 'section4-title', 'section5-title'
    ]);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        var type = model.t;
        var elem = 'h' + type.replace(/^.*?([0-5]).*$/, '$1');
        return React.createElement(elem, null, BaseNodeView.renderChildren(children));
    }
}

class RenderTemplate extends BaseNodeView {
    static registered = registerMap(RenderTemplate, ['template']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<span className={'ast-'+model.t}>{"{{"}{BaseNodeView.renderChildren(children)}{"}}"}</span>);
    }
}

class RenderLink extends BaseNodeView {
    static registered = registerMap(RenderLink, ['link']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        var spacer: IAstModel = {t:'plain-text',v:'|'};
        var spacers = _.fill(new Array(children.length), spacer);
        var c = _.flatten(_.zip(children, spacers)).slice(0, -1);

        return (<span className={'ast-'+model.t}>{"["}{BaseNodeView.renderChildren(c)}{"]"}</span>);
    }
}


class AstDocView extends React.Component<IAstProps, IEmptyState> {

    public render() {
        return (
            <div className="docView" >
                <b><i>Doc View</i></b>
                <RootNodeView model={this.props.model}/>
            </div>
        );
    }
}

export { AstDocView };
