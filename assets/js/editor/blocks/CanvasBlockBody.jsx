import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, constants, mapDispatchToProps, styles } from 'utils';
import BlockTextEditor from './BlockTextEditor';
import BlockImageEditor from './BlockImageEditor';
import BlockVideoEditor from './BlockVideoEditor';
import BlockAudioEditor from './BlockAudioEditor';
import BlockTextEmpty from './BlockTextEmpty';
import BlockImageEmpty from './BlockImageEmpty';
import BlockVideoEmpty from './BlockVideoEmpty';
import BlockAudioEmpty from './BlockAudioEmpty';
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
   * @returns {*}
   */
  render() {
    const { block, campaignType, isActive, isHover, isDragging, onChange } = this.props;

    const isEmpty = block.text === '' && !block.media && !block.videoUrl && !block.audioUrl;
    const height  = block.height || styles.heights.blocks[campaignType][block.type];

    if (isActive && !block.isLocked) {
      switch (block.type) {
        case 1:
          return <BlockTextEditor block={block} height={height} onChange={onChange} />;
        case 2:
          return <BlockImageEditor block={block} height={height} onChange={onChange} />;
        case 3:
          return <BlockVideoEditor block={block} height={height} onChange={onChange} />;
        case 4:
          return <BlockAudioEditor block={block} height={height} onChange={onChange} />;
        default:
          console.error(`Invalid block type ${block.type}`);
          return null;
      }
    }

    const classes = classNames(`block block-${constants.blockType(block.type)}`, {
      'block-active':        isActive,
      'block-expanded':      (isActive || isHover) && !isEmpty,
      'block-hover':         isHover,
      'block-dragging':      isDragging,
      'block-text-headline': block.isHeadline
    });

    if (isEmpty) {
      switch (block.type) {
        case 1:
          return <BlockTextEmpty block={block} campaignType={campaignType} />;
        case 2:
          return <BlockImageEmpty block={block} campaignType={campaignType} />;
        case 3:
          return <BlockVideoEmpty block={block} campaignType={campaignType} />;
        case 4:
          return <BlockAudioEmpty block={block} campaignType={campaignType} />;
      }
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
