import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps, router } from 'utils';
import { Icon } from 'components';
import { Button } from 'components/bootstrap';
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
export default class Header extends React.PureComponent {
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
   *
   */
  handleOpenClick = () => {
    const { editorModal } = this.props;

    editorModal({
      modal: 'open',
      open:  true
    });
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
  render() {
    const { editor, editorUndo, editorRedo } = this.props;
    const { canvasBlocks, blockIndex } = editor;

    return (
      <header className="editor-header">
        <div className="editor-header-left">
          <Icon name="dice-d20" className="logo" size={2} />
          <h1 className="brand">DragStarter</h1>
        </div>
        <div className="editor-header-middle">
          <div className="editor-header-project-name">
            {editor.projectName} {editor.isChanged && '*'}
          </div>
          <div className="editor-header-buttons">
            <Button icon="file-alt" sm>
              New
            </Button>
            <Button icon="folder-open" onClick={this.handleOpenClick} sm>
              Open
            </Button>
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
        </div>
        <div className="editor-header-right">
          <UserMenu />
        </div>
      </header>
    );
  }
}
