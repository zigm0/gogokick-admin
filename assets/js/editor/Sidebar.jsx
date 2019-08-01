import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { connect, mapDispatchToProps } from 'utils';
import { Icon, Avatar, TeamMemberItem } from 'components';
import { Button } from 'components/bootstrap';
import { SidebarBlock } from 'blocks';
import * as editorActions from 'actions/editorActions';

const mapStateToProps = state => ({
  editor: state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class Sidebar extends React.PureComponent {
  static propTypes = {
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
    const { editor } = this.props;

    return (
      <>
        <h2 className="editor-sidebar-title">
          Team
        </h2>
        <ul className="editor-sidebar-team">
          {editor.teamMembers.map(user => (
            <TeamMemberItem key={user.id} user={user} onClick={this.handleMemberClick} />
          ))}
        </ul>
        <Button theme="none" className="editor-sidebar-team-btn">
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
