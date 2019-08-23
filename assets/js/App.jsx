import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import { Route, Router, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { connect, history, constants, mapDispatchToProps } from 'utils';
import { LoadingCubes, ErrorBoundary } from 'components';
import { editorActions, projectActions } from 'actions';
import * as Modals from 'modals';

const DragDropContext  = React.lazy(() => import('./dnd/DragDropContext'));
const EditorController = React.lazy(() => import('./editor/EditorController'));
const EditorHeader     = React.lazy(() => import('./editor/EditorHeader'));
const EditorSidebar    = React.lazy(() => import('./editor/EditorSidebar'));
const DashboardHeader  = React.lazy(() => import('./dashboard/DashboardHeader'));
const CropperModal     = React.lazy(() => import('./modals/CropperModal'));

const mapStateToProps = state => ({
  modals:        state.ui.modals,
  workspace:     state.ui.workspace,
  campaignType:  state.project.campaignType,
  projectIsBusy: state.project.isBusy,
  editorIsBusy:  state.editor.isBusy,
  userIsBusy:    state.user.isBusy
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, projectActions)
)
export default class App extends React.Component {
  static propTypes = {
    modals:        PropTypes.object.isRequired,
    workspace:     PropTypes.string.isRequired,
    campaignType:  PropTypes.number.isRequired,
    userIsBusy:    PropTypes.bool.isRequired,
    projectIsBusy: PropTypes.bool.isRequired,
    editorIsBusy:  PropTypes.bool.isRequired,
    editorDrop:    PropTypes.func.isRequired
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
  renderModals = () => {
    const { modals } = this.props;

    return (
      <ErrorBoundary>
        <Modals.OpenModal />
        <Modals.LoginModal />
        <Modals.PreviewModal />
        <Modals.ConfirmModal />
        {modals.cropper && (
          <CropperModal />
        )}
        <Modals.PromptModal />
        <Modals.MemberActionsModal />
        <Modals.RegisterModal />
        <Modals.AddMemberModal />
        <Modals.TeamMemberModal />
        <Modals.BlockSettingsModal />
      </ErrorBoundary>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { workspace, campaignType, userIsBusy, editorIsBusy, projectIsBusy } = this.props;

    const classes = classNames(
      'editor h-100',
      `workspace-${workspace}`,
      `editor-campaign-type-${constants.campaignType(campaignType)}`
    );

    return (
      <Suspense fallback={<LoadingCubes />}>
        <div className={classes}>
          <DragDropContext onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd}>
            {workspace === 'editor' ? (
              <EditorHeader />
            ) : (
              <DashboardHeader />
            )}
            <div className="editor-body">
              <EditorSidebar />
              <div className="editor-content">
                <Router history={history}>
                  <Switch>
                    <Route exact path="/editor" component={EditorController} />
                    <Route exact path="/editor/profile" component={EditorController} />
                    <Route exact path="/editor/new" component={EditorController} />
                    <Route exact path="/editor/:id" component={EditorController} />
                    <Route exact path="/editor/:id/settings" component={EditorController} />
                  </Switch>
                </Router>
              </div>
            </div>
          </DragDropContext>
          {this.renderModals()}
          {(userIsBusy || editorIsBusy || projectIsBusy) && (
            <LoadingCubes />
          )}
          <ToastContainer />
        </div>
      </Suspense>
    );
  }
}
