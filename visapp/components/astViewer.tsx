/**
 * Created by jasondent on 16/01/2016.
 */

import React = require('react');
import * as _ from 'lodash';
import { TreeNode } from "./treeNode";
import { AstDocView } from "./astDocView";
import { IWiktionaryQueryResult } from "../../lib/wiktionary/wiktionary-reader";

interface IAstViewerProps {
    appState: ApplicationState
}

class AstViewer extends React.Component<IAstViewerProps, {}> {
    render() {
        const { appState } = this.props;
        const { lang, word } = appState.currentPage;
        const tree = appState.ast || {t: 'Root', v: 'Root'};
        return ((
            <div>
                <div className="row">
                    <div className="col-md-12">
                        Language: {lang}, Word: {word}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 ast-tree-view">Wiki AST
                        <TreeNode model={tree} query={{lang,word}}/>
                    </div>
                    <div className="col-md-8 ast-doc-view">Document:
                        <AstDocView model={tree} query={{lang,word}}/>
                    </div>
                </div>
            </div>
        ));
    }
}

export { AstViewer, IAstViewerProps };
