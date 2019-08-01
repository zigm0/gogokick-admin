import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect, mapDispatchToProps } from 'utils';
import { Row, Column } from 'components/bootstrap';
import { Loading } from 'components';
import { ProjectSettingsModal, LoginModal, RegisterModal, OpenModal, NewProjectModal, ConfirmModal } from 'modals';
import * as editorActions from 'actions/editorActions';
import * as userActions from 'actions/userActions';
import Sidebar from 'editor/Sidebar';
import Canvas from 'editor/Canvas';
import Header from 'editor/Header';

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
    editorOpenProject(1);
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
          <Row>
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
        <OpenModal />
        <LoginModal />
        <ConfirmModal />
        <RegisterModal />
        <NewProjectModal />
        <ProjectSettingsModal />
      </div>
    );
  }
}
