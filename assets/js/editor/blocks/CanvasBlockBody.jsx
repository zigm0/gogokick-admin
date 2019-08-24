import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, constants, mapDispatchToProps, styles } from 'utils';
import { Icon } from 'components';
import BlockEditorText from './BlockEditorText';
import BlockEditorImage from './BlockEditorImage';
import BlockEditorVideo from './BlockEditorVideo';
import BlockEditorAudio from './BlockEditorAudio';
import BlockText from './BlockText';
import BlockImage from './BlockImage';
import BlockVideo from './BlockVideo';
import BlockAudio from './BlockAudio';

const mapStateToProps = state => ({
  campaignType: state.project.campaignType,
});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class CanvasBlockBody extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text:        PropTypes.string,
      type:        PropTypes.number.isRequired,
      width:       PropTypes.number,
      height:      PropTypes.number,
      media:       PropTypes.object,
      videoUrl:    PropTypes.string,
      audioUrl:    PropTypes.string,
      isLocked:    PropTypes.bool,
      isHeadline:  PropTypes.bool,
      description: PropTypes.string
    }).isRequired,
    campaignType: PropTypes.number.isRequired,
    isActive:     PropTypes.bool.isRequired,
    isHover:      PropTypes.bool.isRequired,
    isDragging:   PropTypes.bool.isRequired,
    onChange:     PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

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
  render() {
    const { block, campaignType, isActive, isHover, isDragging, onChange } = this.props;

    const isEmpty = block.text === '' && !block.media && !block.videoUrl && !block.audioUrl;
    const width   = block.width  || styles.widths.blocks[campaignType];
    const height  = block.height || styles.heights.blocks[campaignType][block.type];

    if (isActive && !block.isLocked) {
      switch (block.type) {
        case 1:
          return <BlockEditorText block={block} height={height} onChange={onChange} />;
        case 2:
          return <BlockEditorImage block={block} height={height} onChange={onChange} />;
        case 3:
          return <BlockEditorVideo block={block} height={height} onChange={onChange} />;
        case 4:
          return <BlockEditorAudio block={block} height={height} onChange={onChange} />;
        default:
          console.error(`Invalid block type ${block.type}`);
          return null;
      }
    }

    const classes = classNames(`block block-${constants.blockType(block.type)}`, {
      'block-empty':         isEmpty && !isActive,
      'block-active':        isActive,
      'block-expanded':      (isActive || isHover) && !isEmpty,
      'block-hover':         isHover,
      'block-dragging':      isDragging,
      'block-text-headline': block.isHeadline
    });

    if (isEmpty) {
      const blockStyles = {
        width,
        height
      };

      return (
        <div className={classes} style={blockStyles}>
          <div className="block-empty-dims">
            {blockStyles.width}x{blockStyles.height}
          </div>
          <h2 className="block-description">
            <Icon name={this.getIcon(constants.blockType(block.type))} />
            {block.description || 'Description'}
          </h2>
        </div>
      );
    }

    return (
      <div ref={this.container} className={classes}>
        {{
          1: <BlockText block={block} />,
          2: <BlockImage block={block} />,
          3: <BlockVideo block={block} />,
          4: <BlockAudio block={block} />
        }[block.type]}
      </div>
    );
  }
}
