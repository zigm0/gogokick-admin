import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragDropContext } from 'react-beautiful-dnd';
import { Route, Router, Switch } from 'react-router-dom';
import { connect, history, mapDispatchToProps } from 'utils';
import Header from 'editor/Header';
import EditorBody from 'editor/EditorBody';
import * as editorActions from 'actions/editorActions';
import * as projectActions from 'actions/projectActions';
import * as Modals from 'modals';

const mapStateToProps = state => ({
  project: state.project,
  editor:  state.editor,
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, projectActions)
)
export default class Editor extends React.PureComponent {
  static propTypes = {
    match:       PropTypes.object.isRequired,
    project:     PropTypes.object.isRequired,
    editor:      PropTypes.object.isRequired,
    editorDrop:  PropTypes.func.isRequired,
    projectOpen: PropTypes.func.isRequired
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.state = {
      dragging: false
    };
  }

  /**
   *
   */
  componentDidMount() {
    const { match, projectOpen } = this.props;

    projectOpen(match.params.id || 0);
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { match, project, projectOpen } = this.props;

    if (!project.isSaving && match.params.id && match.params.id !== prevProps.match.params.id) {
      projectOpen(match.params.id || 0);
    }
  }

  /**
   * @param {Event} e
   */
  handleDragEnd = (e) => {
    const { editorDrop } = this.props;

    editorDrop(e);
    this.setState({ dragging: false });
  };

  /**
   *
   */
  handleDragStart = () => {
    this.setState({ dragging: true });
  };

  /**
   * @returns {*}
   */
  render() {
    const { editor } = this.props;

    const classes = classNames('editor h-100', `editor-mode-${editor.mode}`);

    return (
      <div className={classes}>
        <DragDropContext onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd}>
          <Header />
          <Router history={history}>
            <Switch>
              <Route exact path="/editor/:id?" component={EditorBody} />
            </Switch>
          </Router>
        </DragDropContext>

        <Modals.OpenModal />
        <Modals.LoginModal />
        <Modals.PreviewModal />
        <Modals.ConfirmModal />
        <Modals.PromptModal />
        <Modals.MemberActionsModal />
        <Modals.RegisterModal />
        <Modals.AddMemberModal />
        <Modals.TeamMemberModal />
        <Modals.NewProjectModal />
        <Modals.ProjectSettingsModal />
      </div>
    );
  }
}
