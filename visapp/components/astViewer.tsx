/**
 * Created by jasondent on 16/01/2016.
 */

import React = require('react');
import { TreeNode } from './treeNode';
import { AstDocView } from './astDocView';

interface AstViewerProps extends ApplicationState {
}

class AstViewer extends React.Component<AstViewerProps, {}> {
    render() {
        const appState = this.props;
        const { lang, page } = appState.currentPage;
        const tree = appState.ast || {t: 'Root', v: 'Root'};
        return ((
            <div>
                <div className="row">
                    <div className="col-md-12">
                        Language: {lang}, Word: {page}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 ast-tree-view">Wiki AST
                        <TreeNode model={tree} query={{lang, page}}/>
                    </div>
                    <div className="col-md-8 ast-doc-view">Document:
                        <AstDocView model={tree} query={{lang, page}}/>
                    </div>
                </div>
            </div>
        ));
    }
}

export { AstViewer, AstViewerProps };
