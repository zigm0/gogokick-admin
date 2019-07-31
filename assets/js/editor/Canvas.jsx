import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { connect, router, mapDispatchToProps } from 'utils';
import { Container, Row, Column, Button } from 'components/bootstrap';
import { CanvasBlock } from 'blocks';
import UserMenu from './UserMenu';
import * as editorActions from 'actions/editorActions';

const mapStateToProps = state => ({
  editor: state.editor,
  user:   state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class Canvas extends React.PureComponent {
  static propTypes = {
    user:              PropTypes.object.isRequired,
    editor:            PropTypes.object.isRequired,
    editorUndo:        PropTypes.func.isRequired,
    editorRedo:        PropTypes.func.isRequired,
    editorModal:       PropTypes.func.isRequired,
    editorSaveProject: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  handleHelpClick = () => {
    window.open(router.generate('help_index'));
  };

  /**
   * @param {Event} e
   */
  handleSettingsClick = (e) => {
    const { editor, editorModal } = this.props;

    editorModal({
      modal: 'settings',
      open:  !editor.modals.settings
    });
  };

  /**
   *
   */
  handleSaveClick = () => {
    const { user, editorModal, editorSaveProject } = this.props;

    if (!user.isAuthenticated) {
      editorModal({
        modal: 'register',
        open:  true
      });
    } else {
      editorSaveProject();
    }
  };

  /**
   * @returns {*}
   */
  renderHeader = () => {
    const { editor, editorUndo, editorRedo } = this.props;
    const { blockIndex, canvasBlocks } = editor;

    return (
      <div className="editor-header editor-header-canvas">
        <div className="editor-header-project-name">
          {editor.projectName} {editor.isChanged && '*'}
        </div>
        <div className="editor-header editor-header-canvas-buttons">
          <Button icon="file" disabled={editor.isSaving} onClick={this.handleSaveClick} sm>
            Save
          </Button>
          <Button icon="eye" sm>
            Preview
          </Button>
          <Button icon="cog" onClick={this.handleSettingsClick} sm>
            Settings
          </Button>
          <Button icon="undo" disabled={blockIndex === 0} onClick={editorUndo} sm>
            Undo
          </Button>
          <Button icon="redo" disabled={blockIndex === canvasBlocks.length - 1} onClick={editorRedo} sm>
            Redo
          </Button>
          <Button icon="question-circle" onClick={this.handleHelpClick} sm>
            Help
          </Button>
        </div>
        <UserMenu />
      </div>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { editor } = this.props;
    const { canvasBlocks, blockIndex } = editor;

    return (
      <div className="editor-canvas h-100">
        {this.renderHeader()}
        <div className="editor-canvas-body h-100">
          <Container className="h-100">
            <Row>
              <Column xl={8} offsetXl={2}>
                <Droppable droppableId="canvasBlocks">
                  {(provided) => (
                    <ul className="editor-canvas-blocks" ref={provided.innerRef}>
                      {canvasBlocks[blockIndex].map((block, index) => (
                        <CanvasBlock
                          key={block.id}
                          block={block}
                          index={index}
                        />
                      ))}
                    </ul>
                  )}
                </Droppable>
              </Column>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}
