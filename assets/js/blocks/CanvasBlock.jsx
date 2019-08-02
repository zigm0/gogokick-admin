import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { Icon } from 'components';

export default class CanvasBlock extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      type: PropTypes.oneOf(['text', 'image', 'video']).isRequired
    }).isRequired,
    index:          PropTypes.number.isRequired,
    showAssignment: PropTypes.bool
  };

  static defaultProps = {
    showAssignment: true
  };

  /**
   * @returns {*}
   */
  render() {
    const { block, index, showAssignment } = this.props;

    return (
      <Draggable key={block.id} draggableId={block.id} index={index}>
        {(provided) => (
          <li
            id={`canvas-block-${block.id}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`editor-canvas-block editor-canvas-block-${block.type}`}
            style={provided.draggableProps.style}
          >
            {showAssignment && (
              <Icon
                name="exclamation-circle"
                title="Assigned to you"
                className="editor-canvas-block-notice-icon"
              />
            )}
            <h2 className="editor-canvas-block-description">
              {block.description || 'Description'}
            </h2>
            {provided.placeholder}
          </li>
        )}
      </Draggable>
    );
  }
}
