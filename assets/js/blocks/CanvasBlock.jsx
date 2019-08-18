import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { connect, constants, mapDispatchToProps } from 'utils';
import { Button } from 'components';
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
      id:   PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.inner  = React.createRef();
    this.$inner = null;
  }

  /**
   *
   */
  componentDidMount() {
    this.$inner = $(this.inner.current);
  }

  /**
   * @param {*} nextProps
   */
  componentWillUpdate(nextProps) {
    const { block, hoverBlockID, activeBlockID } = this.props;

    if (block.type !== 1) {
      // return;
    }

    const nextBlock  = nextProps.block;
    const isActive   = activeBlockID === block.id;
    const isHover    = hoverBlockID === block.id;
    const willActive = nextProps.activeBlockID === nextProps.block.id;
    const willHover  = nextProps.hoverBlockID === nextProps.block.id;
    // const isEmpty    = nextBlock.text === '' && !nextBlock.media;
    const isEmpty = false;

    if (!isEmpty && (isActive !== willActive || isHover !== willHover)) {
      if (willActive || willHover) {
        this.$inner
          .height(1)
          .height(this.$inner[0].scrollHeight);
      } else {
        this.$inner.css('height', 'auto');
      }
    }
  }

  /**
   *
   */
  handleChange = () => {
    // if (this.inner.current.style.height !== 'auto') {
      this.$inner
        .height(1)
        .height(this.$inner[0].scrollHeight);
    // }
  };

  /**
   * @param {Event} e
   * @param {*} block
   */
  handleRemoveClick = (e, block) => {
    const { editorRemove } = this.props;

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
   * @param {Event} e
   */
  handleClick = (e) => {
    const { block, activeBlockID, editorActivateBlock } = this.props;

    if (!e.target.classList.contains('icon') && block.id !== activeBlockID) {
      editorActivateBlock(block.id);
    }
  };

  /**
   * @param {Event} e
   */
  handleSettingsClick = (e) => {
    e.preventDefault();
  };

  /**
   * @param {*} provided
   * @param {*} source
   * @returns {*}
   */
  renderBlock = (provided, source) => {
    const { block, hoverBlockID, activeBlockID } = this.props;

    const isActive = activeBlockID === block.id;
    const isHover  = hoverBlockID === block.id && !activeBlockID;
    const isEmpty  = block.text === '' && !block.media;
    const classes  = classNames('block-container', {
      'block-hover':    isHover,
      'block-active':   isActive,
      'block-empty':    isEmpty && !isActive,
      'block-dragging': source.isDragging
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
        onClick={this.handleClick}
      >
        <div ref={this.inner} className="block-container-inner">
          <div className={`block-menu block-menu-${constants.blockType(block.type)} block-container-menu`}>
            <div className="flex-grow-1">
              <Button
                title="Settings"
                icon="cog"
                className="block-menu-item"
                onClick={this.handleSettingsClick}
              />
              <Button
                title="Move up"
                icon="caret-up"
                className="block-menu-item"
              />
              <Button
                title="Move down"
                icon="caret-down"
                className="block-menu-item"
              />
            </div>
            <div className="flex-grow-1 text-right">
              <Button
                title="Delete"
                icon="times"
                className="block-menu-item block-menu-item-remove"
                onClick={e => this.handleRemoveClick(e, block)}
              />
            </div>
          </div>
          <BlockBody
            block={block}
            isActive={isActive}
            isHover={isHover}
            isDragging={source.isDragging}
            onRemove={this.handleRemoveClick}
            onChange={this.handleChange}
          />
        </div>
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
        {(provided, source) => (
          this.renderBlock(provided, source)
        )}
      </Draggable>
    );
  }
}
