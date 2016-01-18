/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import React = require('react');
import ReactDOM = require('react-dom');
import * as _ from 'lodash';
import jQuery = require('jquery');
import ReactElement = __React.ReactElement;
import { Link } from 'react-router';

interface IAstViewProps extends IAstProps {}

type NodeViewConstructor = new(...params:any[])=>BaseNodeView;
var mapTypeToViewNodes:Dictionary<NodeViewConstructor> = {};

function registerMap(conFn: NodeViewConstructor, relevantTypes:string[]) {
    var map = _.forEach(relevantTypes, (type:string)=>{ mapTypeToViewNodes[type] = conFn; });
    return true;
}


class BaseNodeView extends React.Component<IAstViewProps, IEmptyState> {

    public renderChildren(children : IAstModel[]) : React.ReactElement<IAstViewProps>|React.ReactElement<IAstViewProps>[] {
        if (children.length) {
            return (children.map((model:IAstModel, key:number)=>{ return this.renderChild(key, model); }));
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
                    {this.renderChildren(children)}
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

    protected renderChild(key: string|number, model:IAstModel) {
        const { query } = this.props;
        if (model) {
            var viewClassConstructor = mapTypeToViewNodes[model.t] || BaseNodeView;
            return React.createElement(viewClassConstructor, {key: key, model:model, query: query});
        }
        return (<span>{"{{null}}"}</span>);
    }
}


class RootNodeView extends BaseNodeView {
    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (
            <div>
                {this.renderChildren([model])}
            </div>
        );
    }

}

class RenderChildren extends BaseNodeView {
    static registered = registerMap(RenderChildren, [
        'article', 'paragraph', 'paragraphs', 'sections', 'line-of-text', 'lines-of-text', 'wiki-page',
        'section1', 'section2', 'section3', 'section4', 'section5', 'comment'
    ]);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<div className={'ast-'+model.t}>{this.renderChildren(children)}</div>);
    }
}

class RenderSectionContent extends BaseNodeView {
    static registered = registerMap(RenderSectionContent, [
        'section1-content', 'section2-content', 'section3-content', 'section4-content', 'section5-content'
    ]);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<div className={'ast-'+model.t+' treeNode'}>{this.renderChildren(children)}</div>);
    }
}

class RenderOrderedList extends BaseNodeView {
    static registered = registerMap(RenderOrderedList, ['ordered-list']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<ol className={'ast-'+model.t}>{this.renderChildren(children)}</ol>);
    }
}

class RenderUnorderedList extends BaseNodeView {
    static registered = registerMap(RenderUnorderedList, ['unordered-list']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<ul className={'ast-'+model.t}>{this.renderChildren(children)}</ul>);
    }
}

class RenderIndentedList extends BaseNodeView {
    static registered = registerMap(RenderIndentedList, ['indented-list']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<ul className={'ast-'+model.t + ' indented-list'}>{this.renderChildren(children)}</ul>);
    }
}

class RenderListItem extends BaseNodeView {
    static registered = registerMap(RenderListItem, ['list-item']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<li className={'ast-'+model.t}>{this.renderChildren(children)}</li>);
    }
}

class RenderSpan extends BaseNodeView {
    static registered = registerMap(RenderSpan, ['text', 'template-name', 'template-param']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<span className={'ast-'+model.t}>{this.renderChildren(children)}</span>);
    }
}

class RenderBold extends BaseNodeView {
    static registered = registerMap(RenderBold, ['bold-text']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<b className={'ast-'+model.t}>{this.renderChildren(children)}</b>);
    }
}

class RenderItalic extends BaseNodeView {
    static registered = registerMap(RenderItalic, ['italic-text']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<i className={'ast-'+model.t}>{this.renderChildren(children)}</i>);
    }
}

class RenderHtml extends BaseNodeView {
    static registered = registerMap(RenderHtml, ['sub', 'sup']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return React.createElement(model.t, null, this.renderChildren(children));
    }
}

class RenderTemplateParam extends BaseNodeView {
    static registered = registerMap(RenderTemplateParam, ['template-param']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<span className={'ast-'+model.t}>|{this.renderChildren(children)}</span>);
    }
}

class RenderParseError extends BaseNodeView {
    static registered = registerMap(RenderParseError, ['parse-error']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<pre className={'ast-'+model.t}>{value}</pre>);
    }
}

class RenderSectionTitle extends BaseNodeView {
    static registered = registerMap(RenderSectionTitle, [
        'section1-title', 'section2-title', 'section3-title', 'section4-title', 'section5-title'
    ]);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        var type = model.t;
        var elem = 'h' + type.replace(/^.*?([0-5]).*$/, '$1');
        return React.createElement(elem, null, this.renderChildren(children));
    }
}

class RenderTemplate extends BaseNodeView {
    static registered = registerMap(RenderTemplate, ['template']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        return (<span className={'ast-'+model.t}>{"{{"}{this.renderChildren(children)}{"}}"}</span>);
    }
}

class RenderLink extends BaseNodeView {
    static registered = registerMap(RenderLink, ['link']);

    public renderModel(model:IAstModel, value: AstValue, children: IAstModel[]) {
        const params = children.map((n:IAstModel)=>{ return n.v; });
        if ([1,2].indexOf(params.length) >= 0 && (params[0] + '').match(/^(\w| |[-])+$/)) {
            const { query } = this.props;
            const param = params[0];
            const textNode = children[1] || children[0];
            return (<span className={'ast-'+model.t}><Link to={`/${query.lang}/${param}`}>{this.renderChildren([textNode])}</Link></span>);
        }

        const spacer: IAstModel = {t:'plain-text',v:'|'};
        const spacers = _.fill(new Array(children.length), spacer);
        const c = _.flatten(_.zip(children, spacers)).slice(0, -1);

        return (<span className={'ast-'+model.t}>{"["}{this.renderChildren(c)}{"]"}</span>);
    }
}


class AstDocView extends React.Component<IAstProps, IEmptyState> {

    public render() {
        const { props } = this;
        return (
            <div className="docView" >
                <b><i>Doc View</i></b><br/>
                <RootNodeView {...props}/>
            </div>
        );
    }
}

export { AstDocView };
