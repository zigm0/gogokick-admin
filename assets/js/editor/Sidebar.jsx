import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { connect, mapDispatchToProps } from 'utils';
import { Icon, Avatar } from 'components';
import { Button } from 'components/bootstrap';
import { SidebarBlock } from 'blocks';

const mapStateToProps = state => ({
  editor: state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class Sidebar extends React.PureComponent {
  static propTypes = {
    editor: PropTypes.object.isRequired
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
    return (
      <>
        <h2 className="editor-sidebar-title">
          Team
        </h2>
        <ul className="editor-sidebar-team">
          <li className="editor-sidebar-team-member">
            <Avatar src="/images/avatar-1.jpeg" sm />
            <div className="editor-sidebar-team-member-info">
              <span>Scott K.</span>
              <small>Editor/Lead</small>
            </div>
          </li>
          <li className="editor-sidebar-team-member">
            <Avatar src="/images/avatar-2.jpeg" sm />
            <div className="editor-sidebar-team-member-info">
              <span>Val S.</span>
              <small>Graphics</small>
            </div>
          </li>
          <li className="editor-sidebar-team-member">
            <Avatar src="/images/avatar-3.jpeg" sm />
            <div className="editor-sidebar-team-member-info">
              <span>John R.</span>
              <small>Owner</small>
            </div>
          </li>
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
