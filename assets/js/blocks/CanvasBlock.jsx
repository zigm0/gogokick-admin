import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

export default class CanvasBlock extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      type: PropTypes.oneOf(['text', 'image', 'video']).isRequired
    }).isRequired,
    index: PropTypes.number.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block, index } = this.props;

    return (
      <Draggable key={block.id} draggableId={block.id} index={index}>
        {(provided) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`editor-canvas-block editor-canvas-block-${block.type}`}
            style={provided.draggableProps.style}
          >
            &nbsp;
            {provided.placeholder}
          </li>
        )}
      </Draggable>
    );
  }
}
