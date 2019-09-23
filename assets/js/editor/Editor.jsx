import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragDropContext } from 'react-beautiful-dnd';
import { Route, Router, Switch } from 'react-router-dom';
import { connect, history, mapDispatchToProps } from 'utils';
import { LoadingCubes, ErrorBoundary } from 'components';
import { editorActions } from 'actions';
import EditorCanvas from './EditorCanvas';
import EditorNew from './EditorNew';
import EditorMenuSidebar from './EditorMenuSidebar';
import EditorSettings from './EditorSettings';
import EditorSidebar from './EditorSidebar';
import EditorNotes from './EditorNotes';
import EditorExport from './EditorExport';
import EditorNoteCount from './EditorNoteCount';

const mapStateToProps = state => ({
  isLoaded: state.editor.isLoaded
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class Editor extends React.PureComponent {
  static propTypes = {
    isLoaded:   PropTypes.bool.isRequired,
    editorLoad: PropTypes.func.isRequired,
    editorDrop: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { isLoaded, editorLoad } = this.props;

    if (!isLoaded) {
      editorLoad();
    }
  }

  /**
   * @returns {*}
   */
  render() {
    const { isLoaded, editorDrop } = this.props;

    if (!isLoaded) {
      return <LoadingCubes />;
    }

    const classes = classNames('editor-body', {
      'editor-body-auto-height': document.location.pathname === '/editor/new'
    });

    return (
      <DragDropContext onDragEnd={editorDrop}>
        <div className={classes}>
          <EditorSidebar />
          <EditorMenuSidebar />
          <div className="editor-content">
            <ErrorBoundary>
              <Router history={history}>
                <Switch>
                  <Route exact path="/editor/new" component={EditorNew} />
                  <Route exact path="/editor/:id" component={EditorCanvas} />
                  <Route exact path="/editor/:id/export" component={EditorExport} />
                  <Route exact path="/editor/:id/settings" component={EditorSettings} />
                </Switch>
              </Router>
            </ErrorBoundary>
          </div>
          <EditorNoteCount />
          <EditorNotes />
        </div>
      </DragDropContext>
    );
  }
}
