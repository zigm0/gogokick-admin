import React from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import { Route, Router, Switch } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect, history, constants, mapDispatchToProps } from 'utils';
import { LoadingCubes, ErrorBoundary } from 'components';
import EditorController from 'editor/EditorController';

import Header from 'editor/Header';
import Sidebar from 'editor/Sidebar';
import * as editorActions from 'actions/editorActions';
import * as projectActions from 'actions/projectActions';
import * as Modals from 'modals';

const mapStateToProps = state => ({
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
    return (
      <ErrorBoundary>
        <Modals.OpenModal />
        <Modals.LoginModal />
        <Modals.PreviewModal />
        <Modals.ConfirmModal />
        <Modals.CropperModal />
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
      <div className={classes}>
        <DragDropContext onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd}>
          <Header />
          <div className="editor-body">
            <Sidebar />
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
      </div>
    );
  }
}
