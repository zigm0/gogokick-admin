import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { Icon } from 'components';

export default class SidebarBlock extends React.PureComponent {
  static propTypes = {
    type:  PropTypes.oneOf(['text', 'image', 'video']).isRequired,
    index: PropTypes.number.isRequired
  };

  /**
   * @param {string} type
   * @returns {string}
   */
  getLabel = (type) => {
    return {
      text:  'Add Text',
      image: 'Add Image',
      video: 'Add Video'
    }[type];
  };

  /**
   * @param {string} type
   * @returns {string}
   */
  getIcon = (type) => {
    return  {
      text:  'align-center',
      image: 'image',
      video: 'video'
    }[type];
  };

  /**
   * @returns {*}
   */
  renderClone = () => {
    const { type } = this.props;

    return (
      <li className={`editor-sidebar-block editor-sidebar-block-clone editor-sidebar-block-${type}`}>
        <div>{this.getLabel(type)}</div>
        <Icon name={this.getIcon(type)} size={2} />
      </li>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { type, index } = this.props;

    return (
      <Draggable key={type} draggableId={type} index={index}>
        {(provided, snapshot) => {
          const classes = classNames(`editor-sidebar-block editor-sidebar-block-${type}`, {
            'editor-sidebar-block-over':     snapshot.draggingOver === 'canvasBlocks',
            'editor-sidebar-block-dragging': snapshot.isDragging
          });

          return (
            <>
              <li
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={classes}
                style={provided.draggableProps.style}
              >
                <div>{this.getLabel(type)}</div>
                <Icon name={this.getIcon(type)} size={2} />
                {provided.placeholder}
              </li>
              {snapshot.isDragging && this.renderClone()}
            </>
          );
        }}
      </Draggable>
    );
  }
}
