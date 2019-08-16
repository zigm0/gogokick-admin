import React from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import { Route, Router, Switch } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect, history, constants, mapDispatchToProps } from 'utils';
import { Loading } from 'components';
import EditorController from 'editor/EditorController';

import Header from 'editor/Header';
import Sidebar from 'editor/Sidebar';
import * as userActions from "./actions/userActions";
import * as editorActions from 'actions/editorActions';
import * as projectActions from 'actions/projectActions';
import * as Modals from 'modals';
import { Column, Row } from "./components/bootstrap";

const mapStateToProps = state => ({
  campaignType:  state.project.campaignType,
  projectIsBusy: state.project.isBusy,
  editorIsBusy:  state.editor.isBusy,
  userIsBusy:    state.user.isBusy
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
      <>
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
      </>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { campaignType, userIsBusy, editorIsBusy, projectIsBusy } = this.props;

    const classes = classNames('editor h-100', `editor-campaign-type-${constants.campaignTypeString(campaignType)}`);

    return (
      <div className={classes}>
        <DragDropContext onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd}>
          <Header />
          <Row className="editor-body">
            <Column className="editor-sidebar-col d-none d-lg-block d-xl-block" xl={2} lg={3} md={12}>
              <Sidebar />
            </Column>
            <Column className="editor-canvas-col" xl={10} lg={9} md={12}>
              <Router history={history}>
                <Switch>
                  <Route path="/editor/:id?" component={EditorController} />
                  <Route exact path="/editor/:id/settings" component={EditorController} />
                </Switch>
              </Router>
            </Column>
          </Row>
        </DragDropContext>

        {this.renderModals()}
        {(userIsBusy || editorIsBusy || projectIsBusy) && (
          <Loading middle />
        )}
      </div>
    );
  }
}
