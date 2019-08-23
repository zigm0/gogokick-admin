import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import { Route, Router, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { connect, history, constants, mapDispatchToProps } from 'utils';
import { LoadingCubes, ErrorBoundary } from 'components';
import { projectActions } from 'actions';
import * as Modals from 'modals';

const Editor          = React.lazy(() => import('./editor/Editor'));
const EditorHeader    = React.lazy(() => import('./editor/EditorHeader'));
const DashboardHeader = React.lazy(() => import('./dashboard/DashboardHeader'));
const CropperModal    = React.lazy(() => import('./modals/CropperModal'));

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
  mapDispatchToProps(projectActions)
)
export default class App extends React.Component {
  static propTypes = {
    modals:        PropTypes.object.isRequired,
    workspace:     PropTypes.string.isRequired,
    campaignType:  PropTypes.number.isRequired,
    userIsBusy:    PropTypes.bool.isRequired,
    projectIsBusy: PropTypes.bool.isRequired,
    editorIsBusy:  PropTypes.bool.isRequired
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
          {workspace === 'editor' ? (
            <EditorHeader />
          ) : (
            <DashboardHeader />
          )}
          <Router history={history}>
            <Switch>
              <Route path="/editor" component={Editor} />
            </Switch>
          </Router>
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
