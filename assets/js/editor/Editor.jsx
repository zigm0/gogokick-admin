import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect, mapDispatchToProps } from 'utils';
import { Row, Column } from 'components/bootstrap';
import { Loading } from 'components';
import * as editorActions from 'actions/editorActions';
import * as userActions from 'actions/userActions';
import Sidebar from 'editor/Sidebar';
import Canvas from 'editor/Canvas';
import Header from 'editor/Header';
import * as Modals from 'modals';

const mapStateToProps = state => ({
  editor: state.editor,
  user:   state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, userActions)
)
export default class Editor extends React.PureComponent {
  static propTypes = {
    editor:            PropTypes.object.isRequired,
    userMe:            PropTypes.func.isRequired,
    editorDrop:        PropTypes.func.isRequired,
    editorOpenProject: PropTypes.func.isRequired
  };

  /**
   *
   */
  componentDidMount() {
    const { userMe, editorOpenProject } = this.props;

    userMe();
    editorOpenProject(0);
  }

  /**
   * @param {Event} e
   */
  handleDragEnd = (e) => {
    const { editorDrop } = this.props;

    editorDrop(e);
  };

  /**
   * @returns {*}
   */
  render() {
    const { user, editor } = this.props;

    const classes = classNames('editor h-100', `editor-mode-${editor.mode}`);

    return (
      <div className={classes}>
        <DragDropContext onDragEnd={this.handleDragEnd}>
          <Header />
          <Row className="editor-body">
            <Column className="editor-sidebar-col d-none d-lg-block d-xl-block" xl={2} lg={3} md={12}>
              <Sidebar />
            </Column>
            <Column className="editor-canvas-col" xl={10} lg={9} md={12}>
              <Canvas />
            </Column>
          </Row>
        </DragDropContext>
        {(editor.isBusy || user.isBusy) && (
          <Loading middle />
        )}
        <Modals.OpenModal />
        <Modals.LoginModal />
        <Modals.PreviewModal />
        <Modals.ConfirmModal />
        <Modals.PromptModal />
        <Modals.RegisterModal />
        <Modals.AddMemberModal />
        <Modals.TeamMemberModal />
        <Modals.NewProjectModal />
        <Modals.ProjectSettingsModal />
      </div>
    );
  }
}
