import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { connect, constants, mapDispatchToProps } from 'utils';
import { Icon } from 'components';
import * as editorActions from 'actions/editorActions';
import BlockBody from './BlockBody';

const mapStateToProps = state => ({
  hoverBlockID:  state.editor.hoverBlockID,
  activeBlockID: state.editor.activeBlockID
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class CanvasBlock extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      type: PropTypes.number.isRequired
    }).isRequired,
    index:               PropTypes.number.isRequired,
    hoverBlockID:        PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    activeBlockID:       PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    editorRemove:        PropTypes.func.isRequired,
    editorHoverBlock:    PropTypes.func.isRequired,
    editorActivateBlock: PropTypes.func.isRequired
  };

  static defaultProps = {
    showAssignment: true
  };

  /**
   *
   */
  handleRemoveClick = () => {
    const { block, editorRemove } = this.props;

    editorRemove(block);
  };

  /**
   *
   */
  handleEditClick = () => {
    const { block, activeBlockID, editorActivateBlock } = this.props;

    editorActivateBlock(activeBlockID === block.id ? 0 : block.id);
  };

  /**
   *
   */
  handleMouseEnter = () => {
    const { block, editorHoverBlock } = this.props;

    editorHoverBlock(block.id);
  };

  /**
   *
   */
  handleMouseLeave = () => {
    const { editorHoverBlock } = this.props;

    editorHoverBlock(0);
  };

  /**
   * @param {*} provided
   * @returns {*}
   */
  renderBlock = (provided) => {
    const { block, hoverBlockID, activeBlockID } = this.props;

    const isActive = activeBlockID === block.id;
    const isHover  = hoverBlockID === block.id;
    const classes  = classNames('block-container', {
      'block-hover':  isHover,
      'block-active': isActive
    });

    return (
      <li
        className={classes}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={provided.draggableProps.style}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className="block-menu block-container-menu">
          <Icon
            name="edit"
            title="Edit"
            className="block-menu-item"
            onClick={this.handleEditClick}
          />
          <Icon
            name="trash"
            title="Remove"
            className="block-menu-item block-menu-item-remove"
            onClick={this.handleRemoveClick}
          />
        </div>
        <BlockBody
          block={block}
          isActive={isActive}
          isHover={isHover}
        />
      </li>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { block, index } = this.props;

    return (
      <Draggable key={block.id} draggableId={block.id} index={index}>
        {(provided) => (
          this.renderBlock(provided)
        )}
      </Draggable>
    );
  }
}
