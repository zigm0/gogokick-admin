import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, history, acl, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { uiActions } from 'actions';

const mapStateToProps = state => ({
  user:         state.user,
  editor:       state.editor,
  project:      state.project,
  sideMenuOpen: state.ui.sideMenuOpen
});

@connect(
  mapStateToProps,
  mapDispatchToProps(uiActions)
)
export default class EditorMenuSidebar extends React.PureComponent {
  static propTypes = {
    user:         PropTypes.object.isRequired,
    editor:       PropTypes.object.isRequired,
    project:      PropTypes.object.isRequired,
    sideMenuOpen: PropTypes.bool.isRequired,
    uiModal:      PropTypes.func.isRequired,
  };

  static defaultProps = {};

  /**
   *
   */
  handleOpenClick = () => {
    history.push('/dashboard');
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
  handlePreviewClick = () => {
    const { uiModal } = this.props;

    uiModal({
      modal: 'preview',
      open:  true
    });
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
  handleSettingsClick = () => {
    const { project } = this.props;

    history.push(`/editor/${project.id}/settings`);
  };

  /**
   * @returns {*}
   */
  render() {
    const { sideMenuOpen, editor } = this.props;
    const { meTeamMember } = editor;
    const { roles } = meTeamMember;

    const classes = classNames('editor-menu-sidebar h-100', {
      'editor-menu-sidebar-open': sideMenuOpen
    });

    return (
      <div className={classes}>
        <Button onClick={this.handleOpenClick}>
          Dashboard
        </Button>
        <Button onClick={this.handleNewClick}>
          New
        </Button>
        {acl(roles, 'preview', 'project') && (
          <Button onClick={this.handlePreviewClick}>
            Preview
          </Button>
        )}
        {acl(roles, 'export', 'project') && (
          <Button onClick={this.handleExportClick}>
            Export
          </Button>
        )}
        {acl(roles, 'settings', 'project') && (
          <Button onClick={this.handleSettingsClick}>
            Settings
          </Button>
        )}
      </div>
    );
  }
}
