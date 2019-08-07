import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { connect, mapDispatchToProps } from 'utils';
import { Icon } from 'components';
import * as editorActions from "../actions/editorActions";
import { editorEvents } from "react-ace/lib/editorOptions";

const mapStateToProps = state => ({
  editor:  state.editor,
  project: state.project
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class CanvasBlock extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      type: PropTypes.oneOf(['text', 'image', 'video']).isRequired
    }).isRequired,
    index:          PropTypes.number.isRequired,
    editorRemove:   PropTypes.func.isRequired
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
            <Icon
              name="trash"
              title="Remove"
              className="editor-canvas-block-notice-icon"
              onClick={this.handleRemoveClick}
            />
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
