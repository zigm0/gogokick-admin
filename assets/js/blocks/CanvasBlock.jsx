import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { connect, mapDispatchToProps } from 'utils';
import * as editorActions from 'actions/editorActions';
import BlockBody from './BlockBody';
import Menu from './Menu';

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
    editorModal:         PropTypes.func.isRequired,
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
    const { hoverBlockID } = this.props;
    const { hoverBlockID: nextHoverBlockID } = nextProps;

    if (hoverBlockID !== nextHoverBlockID) {
      return;
    }

    if (nextProps.activeBlockID === nextProps.block.id) {
      this.$inner
        .height(1)
        .height(this.$inner[0].scrollHeight);
    } else {
      this.$inner.css('height', 'auto');
    }
  }

  /**
   *
   */
  handleChange = () => {
    this.$inner
      .height(1)
      .height(this.$inner[0].scrollHeight);
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
   * @param {*} provided
   * @param {*} source
   * @returns {*}
   */
  renderBlock = (provided, source) => {
    const { block, hoverBlockID, activeBlockID } = this.props;

    const isActive = activeBlockID === block.id;
    const isHover  = hoverBlockID === block.id && !activeBlockID;
    const isEmpty  = block.text === '' && !block.media && !block.videoUrl;
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
          <Menu block={block} className="block-container-menu" />
          <BlockBody
            block={block}
            isActive={isActive}
            isHover={isHover}
            isDragging={source.isDragging}
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
