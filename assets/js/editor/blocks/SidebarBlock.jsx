import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { connect, mapDispatchToProps } from 'utils';
import { Icon } from 'components';

const mapStateToProps = state => ({
  isDragDisabled: state.editor.isDragDisabled
});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class SidebarBlock extends React.PureComponent {
  static propTypes = {
    type:           PropTypes.oneOf(['text', 'image', 'video', 'audio']).isRequired,
    index:          PropTypes.number.isRequired,
    isDragDisabled: PropTypes.bool.isRequired
  };

  /**
   * @param {string} type
   * @returns {string}
   */
  getLabel = (type) => {
    return {
      text:  'Text',
      image: 'Image',
      video: 'Video',
      audio: 'Audio'
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
      video: 'video',
      audio: 'music'
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
    const { type, index, isDragDisabled } = this.props;

    return (
      <Draggable key={type} draggableId={type} index={index} isDragDisabled={isDragDisabled}>
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
                <Icon name={this.getIcon(type)} size={2} />
                <div>{this.getLabel(type)}</div>
              </li>
              {snapshot.isDragging && this.renderClone()}
            </>
          );
        }}
      </Draggable>
    );
  }
}
