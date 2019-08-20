import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Droppable } from 'react-beautiful-dnd';
import { connect, mapDispatchToProps } from 'utils';
import { Icon, TeamMemberItem } from 'components';
import { Button } from 'components/bootstrap';
import { SidebarBlock } from 'blocks';
import * as editorActions from 'actions/editorActions';
import * as uiActions from 'actions/uiActions';

const mapStateToProps = state => ({
  user:          state.user,
  project:       state.project,
  sidebarBlocks: state.editor.sidebarBlocks,
  isSidebarOpen: state.ui.isSidebarOpen
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, uiActions)
)
export default class Sidebar extends React.PureComponent {
  static propTypes = {
    user:             PropTypes.object.isRequired,
    project:          PropTypes.object.isRequired,
    sidebarBlocks:    PropTypes.array.isRequired,
    isSidebarOpen:    PropTypes.bool.isRequired,
    uiModal:          PropTypes.func.isRequired,
    editorTeamMember: PropTypes.func.isRequired
  };

  /**
   * @param {Event} e
   * @param {*} user
   */
  handleMemberClick = (e, user) => {
    const { uiModal, editorTeamMember } = this.props;

    editorTeamMember(user);
    uiModal({
      modal: 'teamMember',
      open:  true
    });
  };

  /**
   *
   */
  handleAddMemberClick = () => {
    const { user, uiModal } = this.props;

    if (!user.isAuthenticated) {
      uiModal({
        modal: 'register',
        open:  true
      })
    } else {
      uiModal({
        modal: 'addMember',
        open:  true
      });
    }
  };

  /**
   * @param {Event} e
   * @param {*} user
   */
  handleMemberBadgeClick = (e, user) => {
    e.stopPropagation();

    const { uiModal, editorTeamMember } = this.props;

    editorTeamMember(user);
    uiModal({
      modal: 'memberActions',
      open:  true
    });
  };

  /**
   * @returns {*}
   */
  renderBlocks = () => {
    const { sidebarBlocks } = this.props;

    return (
      <Droppable droppableId="sidebarBlocks" isDropDisabled>
        {(provided) => (
          <ul className="editor-sidebar-blocks" ref={provided.innerRef}>
            {sidebarBlocks.map((block, index) => (
              <SidebarBlock
                key={block.type}
                type={block.type}
                index={index}
              />
            ))}
          </ul>
        )}
      </Droppable>
    );
  };

  /**
   * @returns {*}
   */
  renderTeam = () => {
    const { project } = this.props;

    return (
      <>
        <h2 className="editor-sidebar-title">
          Team
        </h2>
        {!!project.id && (
          <ul className="editor-team">
            <TeamMemberItem
              projectUser={{
                user: project.owner,
                role: 0
              }}
              onClick={this.handleMemberClick}
              onBadgeClick={this.handleMemberBadgeClick}
            />
            {project.team.map(projectUser => (
              <TeamMemberItem
                key={projectUser.id}
                projectUser={projectUser}
                onClick={this.handleMemberClick}
                onBadgeClick={this.handleMemberBadgeClick}
              />
            ))}
          </ul>
        )}
        <Button theme="none" className="editor-team-btn" onClick={this.handleAddMemberClick}>
          <Icon name="plus-circle" />
          Add Member
        </Button>
      </>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { isSidebarOpen } = this.props;

    const classes = classNames('editor-sidebar h-100', {
      'editor-sidebar-closed': !isSidebarOpen
    });

    return (
      <div className={classes}>
        <div className="editor-sidebar-body">
          {this.renderBlocks()}
          {this.renderTeam()}
        </div>
      </div>
    );
  }
}
