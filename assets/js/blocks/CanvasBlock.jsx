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
            id={`canvas-block-${block.id}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`editor-canvas-block editor-canvas-block-${block.type}`}
            style={provided.draggableProps.style}
          >
            <h2 className="editor-canvas-block-description">
              Description
            </h2>
            {provided.placeholder}
          </li>
        )}
      </Draggable>
    );
  }
}
