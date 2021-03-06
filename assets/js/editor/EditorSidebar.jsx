import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { connect, history, constants, acl, mapDispatchToProps } from 'utils';
import { Icon, TeamMemberItem } from 'components';
import { Button } from 'components/bootstrap';
import { SidebarBlock } from 'editor/blocks';
import { editorActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  user:          state.user,
  project:       state.project,
  teamMember:    state.editor.teamMember,
  meTeamMember:  state.editor.meTeamMember,
  workspace:     state.ui.workspace,
  sidebarBlocks: state.editor.sidebarBlocks
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, uiActions)
)
export default class EditorSidebar extends React.PureComponent {
  static propTypes = {
    workspace:     PropTypes.string.isRequired,
    teamMember:    PropTypes.object,
    meTeamMember:  PropTypes.object.isRequired,
    user:          PropTypes.object.isRequired,
    project:       PropTypes.object.isRequired,
    uiModal:       PropTypes.func.isRequired,
    sidebarBlocks: PropTypes.array.isRequired
  };

  /**
   * @param {Event} e
   * @param {*} user
   */
  handleMemberClick = (e, user) => {
    const { uiModal, meTeamMember } = this.props;

    if (acl(meTeamMember.roles, 'view', 'teamMember')) {
      uiModal({
        modal: 'teamMember',
        open:  true,
        meta:  user
      });
    }
  };

  /**
   *
   */
  handleAddMemberClick = () => {
    const { user, uiModal, meTeamMember } = this.props;

    if (acl(meTeamMember.roles, 'add', 'teamMember')) {
      if (!user.isAuthenticated) {
        history.push('/login');
      } else {
        uiModal({
          modal: 'addMember',
          open:  true
        });
      }
    }
  };

  /**
   * @param {Event} e
   * @param {*} user
   */
  handleMemberBadgeClick = (e, user) => {
    e.stopPropagation();

    const { uiModal } = this.props;

    uiModal({
      modal: 'memberActions',
      open:  true,
      meta:  user
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
    const { project, meTeamMember } = this.props;

    return (
      <>
        <h2 className="editor-sidebar-title">
          Team
        </h2>
        {!!project.id && (
          <ul className="editor-team">
            <TeamMemberItem
              projectUser={{
                user:  project.owner,
                roles: [constants.projectRole('owner')]
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
        {acl(meTeamMember.roles, 'add', 'teamMember') && (
          <Button theme="none" className="editor-team-btn" onClick={this.handleAddMemberClick}>
            <Icon name="plus-circle" />
            <div className="editor-team-member-info text-left">
              <span>Invite</span>
              <small>New Team Member</small>
            </div>
          </Button>
        )}
      </>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <div className="editor-sidebar h-100">
        <div className="editor-sidebar-body">
          {this.renderBlocks()}
          {this.renderTeam()}
        </div>
      </div>
    );
  }
}
