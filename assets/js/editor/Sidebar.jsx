import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { connect, mapDispatchToProps } from 'utils';
import { Icon, TeamMemberItem } from 'components';
import { Button } from 'components/bootstrap';
import { SidebarBlock } from 'blocks';
import * as editorActions from 'actions/editorActions';

const mapStateToProps = state => ({
  editor:  state.editor,
  project: state.project
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class Sidebar extends React.PureComponent {
  static propTypes = {
    project:          PropTypes.object.isRequired,
    editor:           PropTypes.object.isRequired,
    editorModal:      PropTypes.func.isRequired,
    editorTeamMember: PropTypes.func.isRequired
  };

  /**
   * @param {Event} e
   * @param {*} user
   */
  handleMemberClick = (e, user) => {
    const { editorModal, editorTeamMember } = this.props;

    editorTeamMember(user);
    editorModal({
      modal: 'teamMember',
      open:  true
    });
  };

  /**
   *
   */
  handleAddMemberClick = () => {
    const { editorModal } = this.props;

    editorModal({
      modal: 'addMember',
      open:  true
    });
  };

  /**
   * @param {Event} e
   * @param {*} user
   */
  handleMemberBadgeClick = (e, user) => {
    e.stopPropagation();

    const { editorModal, editorTeamMember } = this.props;

    editorTeamMember(user);
    editorModal({
      modal: 'memberActions',
      open:  true
    });
  };

  /**
   * @returns {*}
   */
  renderBlocks = () => {
    const { editor } = this.props;

    return (
      <Droppable droppableId="sidebarBlocks" isDropDisabled>
        {(provided) => (
          <ul className="editor-sidebar-blocks" ref={provided.innerRef}>
            {editor.sidebarBlocks.map((block, index) => (
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
