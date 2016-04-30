
/* tslint:disable:no-unused-variable */
// Required for JSX to compile
import React = require('react');
/* tslint:enable:no-unused-variable */
import * as _ from 'lodash';
import { Link } from 'react-router';

const assign = _.assign;

interface AstViewProps extends AstProps {}

type NodeViewConstructor = new(...params: any[]) => BaseNodeView;
let mapTypeToViewNodes: Dictionary<NodeViewConstructor> = {};

function registerMap(conFn: NodeViewConstructor, relevantTypes: string[]) {
    _.forEach(relevantTypes, (type: string) => { mapTypeToViewNodes[type] = conFn; });
    return true;
}

interface ModelProperties extends AstViewProps {
    value: AstValue;
    children: AstModel[];
}


class BaseNodeView extends React.Component<AstViewProps, EmptyState> {

    public renderChildren(children: AstModel[]): React.ReactElement<AstViewProps> | React.ReactElement<AstViewProps>[] {
        if (children.length) {
            return (children.map((model: AstModel, key: number) => { return this.renderChild(key, model); }));
        }
        return (<span key={0}>{'{{empty}}'}</span>);
    }

    public renderModel(p: ModelProperties) {
        const {key, model, value, children} = p;
        if (value !== undefined) {
            return (
                <span>{value}</span>
            );
        }

        return (
            <div key={key} className="docView" >
                <b><i>{model.t}</i></b>
                <div>
                    {this.renderChildren(children)}
                </div>
            </div>
        );
    }


    public render() {
        const { props } = this;
        const { model } = props;
        const value = model.v;
        const children = model.c || [];
        const p: ModelProperties = assign({}, props, {value, children}) as ModelProperties;
        return this.renderModel(p);
    }

    protected renderChild(key: string|number, model: AstModel) {
        key = key || 0;
        const { query } = this.props;
        if (model) {
            const viewClassConstructor = mapTypeToViewNodes[model.t] || BaseNodeView;
            return React.createElement(viewClassConstructor, {key: key, model: model, query: query});
        }
        return (<span key={key}>{'{{null}}'}</span>);
    }
}


class RootNodeView extends BaseNodeView {
    public renderModel(p: ModelProperties) {
        return (
            <div key={0}>
                {this.renderChildren([p.model])}
            </div>
        );
    }

}

class RenderChildren extends BaseNodeView {
    static registered = registerMap(RenderChildren, [
        'article', 'paragraph', 'paragraphs', 'sections', 'line-of-text', 'lines-of-text', 'wiki-page',
        'section1', 'section2', 'section3', 'section4', 'section5', 'comment'
    ]);

    public renderModel(p: ModelProperties) {
        const {key, model, children} = p;
        return (<div key={key} className={'ast-' + model.t}>{this.renderChildren(children)}</div>);
    }
}

class RenderSectionContent extends BaseNodeView {
    static registered = registerMap(RenderSectionContent, [
        'section1-content', 'section2-content', 'section3-content', 'section4-content', 'section5-content'
    ]);

    public renderModel(p: ModelProperties) {
        const {key, model, children} = p;
        return (<div key={key} className={'ast-' + model.t + ' treeNode'}>{this.renderChildren(children)}</div>);
    }
}

class RenderOrderedList extends BaseNodeView {
    static registered = registerMap(RenderOrderedList, ['ordered-list']);

    public renderModel(p: ModelProperties) {
        const {key, model, children} = p;
        return (<ol key={key} className={'ast-' + model.t}>{this.renderChildren(children)}</ol>);
    }
}

class RenderUnorderedList extends BaseNodeView {
    static registered = registerMap(RenderUnorderedList, ['unordered-list']);

    public renderModel(p: ModelProperties) {
        const {key, model, children} = p;
        return (<ul key={key} className={'ast-' + model.t}>{this.renderChildren(children)}</ul>);
    }
}

class RenderIndentedList extends BaseNodeView {
    static registered = registerMap(RenderIndentedList, ['indented-list']);

    public renderModel(p: ModelProperties) {
        const {key, model, children} = p;
        return (<ul key={key} className={'ast-' + model.t + ' indented-list'}>{this.renderChildren(children)}</ul>);
    }
}

class RenderListItem extends BaseNodeView {
    static registered = registerMap(RenderListItem, ['list-item']);

    public renderModel(p: ModelProperties) {
        const {key, model, children} = p;
        return (<li key={key} className={'ast-' + model.t}>{this.renderChildren(children)}</li>);
    }
}

class RenderSpan extends BaseNodeView {
    static registered = registerMap(RenderSpan, ['text', 'template-name', 'template-param']);

    public renderModel(p: ModelProperties) {
        const {key, model, children} = p;
        return (<span key={key} className={'ast-' + model.t}>{this.renderChildren(children)}</span>);
    }
}

class RenderBold extends BaseNodeView {
    static registered = registerMap(RenderBold, ['bold-text']);

    public renderModel(p: ModelProperties) {
        const {key, model, children} = p;
        return (<b key={key} className={'ast-' + model.t}>{this.renderChildren(children)}</b>);
    }
}

class RenderItalic extends BaseNodeView {
    static registered = registerMap(RenderItalic, ['italic-text']);

    public renderModel(p: ModelProperties) {
        const {key, model, children} = p;
        return (<i key={key} className={'ast-' + model.t}>{this.renderChildren(children)}</i>);
    }
}

class RenderHtml extends BaseNodeView {
    static registered = registerMap(RenderHtml, ['sub', 'sup']);

    public renderModel(p: ModelProperties) {
        const {model, children} = p;
        return React.createElement(model.t, null, this.renderChildren(children));
    }
}

class RenderTemplateParam extends BaseNodeView {
    static registered = registerMap(RenderTemplateParam, ['template-param']);

    public renderModel(p: ModelProperties) {
        const {key, model, children} = p;
        return (<span key={key} className={'ast-' + model.t}>|{this.renderChildren(children)}</span>);
    }
}

class RenderParseError extends BaseNodeView {
    static registered = registerMap(RenderParseError, ['parse-error']);

    public renderModel(p: ModelProperties) {
        const {key, model, value} = p;
        return (<pre key={key} className={'ast-' + model.t}>{value}</pre>);
    }
}

class RenderSectionTitle extends BaseNodeView {
    static registered = registerMap(RenderSectionTitle, [
        'section1-title', 'section2-title', 'section3-title', 'section4-title', 'section5-title'
    ]);

    public renderModel(p: ModelProperties) {
        const {model, children} = p;
        const type = model.t;
        const elem = 'h' + type.replace(/^.*?([0-5]).*$/, '$1');
        return React.createElement(elem, null, this.renderChildren(children));
    }
}

class RenderTemplate extends BaseNodeView {
    static registered = registerMap(RenderTemplate, ['template']);

    public renderModel(p: ModelProperties) {
        const {key, model, children} = p;
        return (<span key={key} className={'ast-' + model.t}>{'{{'}{this.renderChildren(children)}{'}}'}</span>);
    }
}

class RenderLink extends BaseNodeView {
    static registered = registerMap(RenderLink, ['link']);

    public renderModel(p: ModelProperties) {
        const {key, model, children} = p;
        const params = children.map((n: AstModel) => { return n.v; });
        if ([1, 2].indexOf(params.length) >= 0 && (params[0] + '').match(/^(\w| |[-])+$/)) {
            const { query } = this.props;
            const param = params[0];
            const textNode = children[1] || children[0];
            return (
                <span
                    key={key}
                    className={'ast-' + model.t}>
                    <Link to={`/${query.lang}/${param}`}>{this.renderChildren([textNode])}</Link>
                </span>);
        }

        const spacer: AstModel = {id: undefined, t: 'plain-text', v: '|'};
        const spacers = _.fill(new Array(children.length), spacer);
        const c = _.flatten(_.zip(children, spacers)).slice(0, -1);

        return (<span key={key} className={'ast-' + model.t}>{'['}{this.renderChildren(c)}{']'}</span>);
    }
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
