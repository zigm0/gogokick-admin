import React from 'react';
import PropTypes from 'prop-types';
import { connect, history, mapDispatchToProps, router } from 'utils';
import { Icon, Link } from 'components';
import { Row, Column, Button } from 'components/bootstrap';
import UserMenu from 'layout/UserMenu';
import { editorActions, projectActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  editor:  state.editor,
  project: state.project,
  user:    state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, projectActions, uiActions)
)
export default class EditorHeader extends React.PureComponent {
  static propTypes = {
    user:        PropTypes.object.isRequired,
    editor:      PropTypes.object.isRequired,
    project:     PropTypes.object.isRequired,
    editorUndo:  PropTypes.func.isRequired,
    editorRedo:  PropTypes.func.isRequired,
    uiModal:     PropTypes.func.isRequired,
    projectSave: PropTypes.func.isRequired
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
    const { user } = this.props;

    if (!user.isAuthenticated) {
      history.push('/login');
    } else {
      history.push('/editor/new');
    }
  };

  /**
   *
   */
  handleOpenClick = () => {
    history.push('/dashboard');
  };

  /**
   *
   */
  handleSettingsClick = () => {
    const { project } = this.props;

    history.push(`/editor/${project.id}/settings`);
  };

  /**
   *
   */
  handlePreviewClick = () => {
    const { uiModal } = this.props;

    uiModal({
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
          <Link to="/">
            <img src="/images/logo.png" alt="Logo" />
          </Link>
        </div>
        <div className="editor-header-middle">
          <Row style={{ width: '100%' }}>
            <Column className="editor-header-buttons d-none d-lg-block d-xl-block" offsetXl={3}>
              <Button onClick={this.handleOpenClick}>
                Dashboard
              </Button>
              <Button onClick={this.handleNewClick}>
                New
              </Button>
              <Button onClick={this.handlePreviewClick}>
                Preview
              </Button>
              <Button>
                Export
              </Button>
              <Button onClick={this.handleSettingsClick}>
                Settings
              </Button>
              <Button disabled={blockIndex === 0} onClick={editorUndo}>
                Undo
              </Button>
              <Button disabled={blockIndex === canvasBlocks.length - 1} onClick={editorRedo}>
                Redo
              </Button>
              <Button onClick={this.handleHelpClick}>
                Help
              </Button>
            </Column>
          </Row>
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
