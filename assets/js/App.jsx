import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import { Route, Router, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { connect, history, constants, browser, mapDispatchToProps } from 'utils';
import { LoadingCubes, ErrorBoundary, ProtectedRoute } from 'components';
import { projectActions, userActions, uiActions } from 'actions';
import Footer from 'layout/Footer';
import * as Modals from 'modals';

const Home            = React.lazy(() => import('./dashboard/Home'));
const Login           = React.lazy(() => import('./dashboard/Login'));
const NotFound        = React.lazy(() => import('./dashboard/NotFound'));
const Register        = React.lazy(() => import('./dashboard/Register'));
const Profile         = React.lazy(() => import('./dashboard/Profile'));
const Dashboard       = React.lazy(() => import('./dashboard/Dashboard'));
const Project         = React.lazy(() => import('./dashboard/Project'));
const ProjectPreview  = React.lazy(() => import('./dashboard/ProjectPreview'));
const Invite          = React.lazy(() => import('./dashboard/Invite'));
const Editor          = React.lazy(() => import('./editor/Editor'));
const HomeHeader      = React.lazy(() => import('./dashboard/HomeHeader'));
const EditorHeader    = React.lazy(() => import('./editor/EditorHeader'));
const Content         = React.lazy(() => import('./dashboard/Content'));
const DashboardHeader = React.lazy(() => import('./dashboard/DashboardHeader'));
const CropperModal    = React.lazy(() => import('./modals/CropperModal'));

const mapStateToProps = state => ({
  workspace:     state.ui.workspace,
  campaignType:  state.project.campaignType,
  projectIsBusy: state.project.isBusy,
  isPreview:     state.project.isPreview,
  editorIsBusy:  state.editor.isBusy,
  user:          state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions, userActions, uiActions)
)
export default class App extends React.Component {
  static propTypes = {
    workspace:     PropTypes.string.isRequired,
    campaignType:  PropTypes.number.isRequired,
    user:          PropTypes.object.isRequired,
    projectIsBusy: PropTypes.bool.isRequired,
    editorIsBusy:  PropTypes.bool.isRequired,
    isPreview:     PropTypes.bool.isRequired,
    userMe:        PropTypes.func.isRequired,
    uiInitialize:  PropTypes.func.isRequired,
  };

  /**
   *
   */
  componentDidMount() {
    const { userMe, uiInitialize } = this.props;

    this.resizeOff = browser.on('resize', this.handleResize);

    uiInitialize(window.innerWidth, window.innerHeight);
    userMe();
  }

  /**
   *
   */
  componentWillUnmount() {
    this.resizeOff();
  }

  /**
   *
   */
  handleResize = () => {
    const { uiInitialize } = this.props;

    uiInitialize(window.innerWidth, window.innerHeight);
  };

  /**
   * @returns {*}
   */
  renderModals = () => {
    const { user } = this.props;

    if (!user.id) {
      return null;
    }

    return (
      <ErrorBoundary>
        <Modals.OpenModal />
        <Modals.PreviewModal />
        <Modals.ConfirmModal />
        <CropperModal />
        <Modals.PromptModal />
        <Modals.MemberActionsModal />
        <Modals.AddMemberModal />
        <Modals.TeamMemberModal />
        <Modals.BlockSettingsModal />
        <Modals.BlockDetailsModal />
      </ErrorBoundary>
    );
  };

  /**
   * @returns {*}
   */
  renderHeader = () => {
    const { workspace, isPreview } = this.props;

    if (!isPreview && (workspace === 'editor' || workspace === 'project-export' || workspace === 'project-settings')) {
      return <EditorHeader />;
    } else if (workspace === 'home') {
      return <HomeHeader />;
    } else {
      return <DashboardHeader />;
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { workspace, campaignType, user, editorIsBusy, projectIsBusy } = this.props;

    const classes = classNames(`workspace-${workspace} h-min-100`, {
      'editor':                                                         workspace === 'editor',
      [`editor-campaign-type-${constants.campaignType(campaignType)}`]: workspace === 'editor'
    });

    return (
      <Suspense fallback={<div />}>
        <div className={classes}>
          {this.renderHeader()}
          <div className="workspace-body">
            <Router history={history}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/about" render={() => <Content name="about" />} />
                <Route exact path="/terms" render={() => <Content name="terms" />} />
                <Route exact path="/help" render={() => <Content name="help" />} />
                <Route exact path="/p/:id/:slug" component={Project} />
                <Route exact path="/privacy" render={() => <Content name="privacy" />} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/profile/:id" component={Profile} />
                <Route exact path="/invite/:id/:hash" component={Invite} />
                <Route exact path="/preview/project/:id/:hash" component={ProjectPreview} />
                <ProtectedRoute path="/editor" component={Editor} />
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <Route component={NotFound} />
              </Switch>
            </Router>
          </div>
          {this.renderModals()}
          {(user.isBusy || editorIsBusy || projectIsBusy) && (
            <LoadingCubes />
          )}
          <ToastContainer />
          {workspace !== 'editor' && (
            <Footer />
          )}
        </div>
      </Suspense>
    );
  }
}
