import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import { Route, Router, Switch } from 'react-router-dom';
import { connect, history, mapDispatchToProps } from 'utils';
import { editorActions } from 'actions';

const EditorCanvas     = React.lazy(() => import('./EditorCanvas'));
const EditorNew        = React.lazy(() => import('./EditorNew'));
const EditorSettings   = React.lazy(() => import('./EditorSettings'));
const EditorSidebar    = React.lazy(() => import('./EditorSidebar'));

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class Editor extends React.PureComponent {
  static propTypes = {
    editorDrop: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { editorDrop } = this.props;

    return (
      <DragDropContext onDragEnd={editorDrop}>
        <div className="editor-body">
          <EditorSidebar />
          <div className="editor-content">
            <Router history={history}>
              <Switch>
                <Route exact path="/editor/new" component={EditorNew} />
                <Route exact path="/editor/:id" component={EditorCanvas} />
                <Route exact path="/editor/:id/settings" component={EditorSettings} />
              </Switch>
            </Router>
          </div>
        </div>
      </DragDropContext>
    );
  }
}
