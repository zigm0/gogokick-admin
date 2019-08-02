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
  handleNewClick = () => {
    const { editorModal } = this.props;

    editorModal({
      modal: 'newProject',
      open:  true
    });
  };

  /**
   *
   */
  handleOpenClick = () => {
    const { user, editorModal } = this.props;

    if (!user.isAuthenticated) {
      editorModal({
        modal: 'register',
        open:  true
      });
    } else {
      editorModal({
        modal: 'open',
        open:  true
      });
    }
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
   *
   */
  handlePreviewClick = () => {
    const { editorModal } = this.props;

    editorModal({
      modal: 'preview',
      open:  true
    });
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
          <h1 className="brand d-none d-lg-block d-md-block d-xl-block">DragStarter</h1>
        </div>
        <div className="editor-header-project-name d-none d-xl-block">
          <div>{editor.projectName} {editor.isChanged && '*'}</div>
        </div>
        <div className="editor-header-middle">
          <div className="editor-header-buttons d-none d-lg-block d-xl-block">
            <Button icon="file-alt" onClick={this.handleNewClick} sm>
              New
            </Button>
            <Button icon="folder-open" onClick={this.handleOpenClick} sm>
              Open
            </Button>
            <Button icon="file" disabled={editor.isSaving} onClick={this.handleSaveClick} sm>
              Save
            </Button>
            <Button icon="eye" onClick={this.handlePreviewClick} sm>
              Preview
            </Button>
            <Button icon="download" sm>
              Export
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
          <div className="editor-header-mobile-buttons d-lg-none">
            <button
              type="button"
              className="navbar-toggler toggler-example"
              data-toggle="collapse"
              data-target="#navbarSupportedContent8"
              aria-controls="navbarSupportedContent8"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span>
                <Icon name="bars" fas />
              </span>
            </button>
            <Button icon="align-center" className="btn-block-text" sm>
              <span className="d-none d-lg-inline d-md-inline d-xl-inline">Add Text</span>
            </Button>
            <Button icon="image" className="btn-block-image" sm>
              <span className="d-none d-lg-inline d-md-inline d-xl-inline">Add Image</span>
            </Button>
            <Button icon="video" className="btn-block-video" sm>
              <span className="d-none d-lg-inline d-md-inline d-xl-inline">Add Video</span>
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
