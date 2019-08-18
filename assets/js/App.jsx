import React from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import { Route, Router, Switch } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect, history, constants, mapDispatchToProps } from 'utils';
import { Loading, ErrorBoundary } from 'components';
import EditorController from 'editor/EditorController';

import Header from 'editor/Header';
import Sidebar from 'editor/Sidebar';
import * as userActions from "./actions/userActions";
import * as editorActions from 'actions/editorActions';
import * as projectActions from 'actions/projectActions';
import * as Modals from 'modals';

const mapStateToProps = state => ({
  campaignType:  state.project.campaignType,
  projectIsBusy: state.project.isBusy,
  editorIsBusy:  state.editor.isBusy,
  userIsBusy:    state.user.isBusy,
  isSidebarOpen: state.editor.isSidebarOpen
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions, editorActions, projectActions)
)
export default class App extends React.Component {
  static propTypes = {
    campaignType:  PropTypes.number.isRequired,
    userIsBusy:    PropTypes.bool.isRequired,
    projectIsBusy: PropTypes.bool.isRequired,
    editorIsBusy:  PropTypes.bool.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
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
   *
   */
  componentDidMount() {
    const { userMe } = this.props;

    userMe();
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
    return (
      <ErrorBoundary>
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
        <Modals.BlockSettingsModal />
      </ErrorBoundary>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { campaignType, userIsBusy, editorIsBusy, projectIsBusy, isSidebarOpen } = this.props;

    const classes = classNames('editor h-100', `editor-campaign-type-${constants.campaignType(campaignType)}`);
    const classesContent = classNames('editor-content', {
      'editor-content-sidebar-closed': !isSidebarOpen
    });

    return (
      <div className={classes}>
        <DragDropContext onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd}>
          <Header />
          <div className="editor-body">
            <Sidebar />
            <div className={classesContent}>
              <Router history={history}>
                <Switch>
                  <Route path="/editor/:id?" component={EditorController} />
                  <Route exact path="/editor/:id/settings" component={EditorController} />
                </Switch>
              </Router>
            </div>
          </div>
        </DragDropContext>
        {this.renderModals()}
        {(userIsBusy || editorIsBusy || projectIsBusy) && (
          <Loading middle />
        )}
      </div>
    );
  }
}
