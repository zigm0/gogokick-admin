import React from 'react';
import PropTypes from 'prop-types';
import { connect, history, acl, mapDispatchToProps, router } from 'utils';
import { Icon, Link } from 'components';
import { Row, Column, Button } from 'components/bootstrap';
import UserMenu from 'layout/UserMenu';
import { editorActions, projectActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  editor:       state.editor,
  project:      state.project,
  user:         state.user,
  sideMenuOpen: state.ui.sideMenuOpen
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, projectActions, uiActions)
)
export default class EditorHeader extends React.PureComponent {
  static propTypes = {
    user:              PropTypes.object.isRequired,
    editor:            PropTypes.object.isRequired,
    project:           PropTypes.object.isRequired,
    sideMenuOpen:      PropTypes.bool.isRequired,
    editorUndo:        PropTypes.func.isRequired,
    editorRedo:        PropTypes.func.isRequired,
    uiModal:           PropTypes.func.isRequired,
    uiSidebarMenuOpen: PropTypes.func.isRequired,
    projectSave:       PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  handleSidebarMenuClick = () => {
    const { sideMenuOpen, uiSidebarMenuOpen } = this.props;

    uiSidebarMenuOpen(!sideMenuOpen);
  };

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
  handleExportClick = () => {
    const { project } = this.props;

    history.push(`/editor/${project.id}/export`);
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
    const { canvasBlocks, blockIndex, meTeamMember } = editor;
    const { roles } = meTeamMember;

    return (
      <header className="editor-header">
        <div className="editor-header-left">
          <Link to="/">
            <img src="/images/logo-2.png" alt="Logo" className="logo-desktop" />
            <img src="/images/logo-square.png" alt="Logo" className="logo-mobile" />
          </Link>
        </div>
        <div className="editor-header-middle">
          <Row style={{ width: '100%' }}>
            <Column className="editor-header-buttons d-lg-none" offsetXl={3}>
              <Button onClick={this.handleSidebarMenuClick}>
                <Icon name="bars" />
              </Button>
              <Button disabled={blockIndex === 0} onClick={editorUndo}>
                <Icon name="undo" />
              </Button>
              <Button disabled={blockIndex === canvasBlocks.length - 1} onClick={editorRedo}>
                <Icon name="redo" />
              </Button>
              <Button onClick={this.handleHelpClick}>
                <Icon name="question" />
              </Button>
            </Column>
            <Column className="editor-header-buttons d-none d-lg-block d-xl-block" offsetXl={3}>
              <Button theme="link" onClick={this.handleOpenClick}>
                Dashboard
              </Button>
{/*              <Button theme="link" onClick={this.handleNewClick}>
                New
              </Button>*/}
              {acl(roles, 'preview', 'project') && (
                <Button theme="link" onClick={this.handlePreviewClick}>
                  Preview
                </Button>
              )}
              {acl(roles, 'export', 'project') && (
                <Button theme="link" onClick={this.handleExportClick}>
                  Export
                </Button>
              )}
              {acl(roles, 'settings', 'project') && (
                <Button theme="link" onClick={this.handleSettingsClick}>
                  Settings
                </Button>
              )}
              {acl(roles, 'undo', 'project') && (
                <Button theme="link" disabled={blockIndex === 0} onClick={editorUndo}>
                  Undo
                </Button>
              )}
              {acl(roles, 'undo', 'project') && (
                <Button theme="link" disabled={blockIndex === canvasBlocks.length - 1} onClick={editorRedo}>
                  Redo
                </Button>
              )}
              <Button theme="link" onClick={this.handleHelpClick}>
                Help
              </Button>
            </Column>
          </Row>
        </div>
        <div className="editor-header-right">
          <UserMenu />
        </div>
      </header>
    );
  }
}
