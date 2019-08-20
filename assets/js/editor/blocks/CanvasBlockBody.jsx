import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { constants } from 'utils';
import { Icon } from 'components';
import BlockEditorText from './BlockEditorText';
import BlockEditorImage from './BlockEditorImage';
import BlockEditorVideo from './BlockEditorVideo';
import BlockEditorAudio from './BlockEditorAudio';
import BlockText from './BlockText';
import BlockImage from './BlockImage';
import BlockVideo from './BlockVideo';
import BlockAudio from './BlockAudio';

export default class CanvasBlockBody extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text:       PropTypes.string,
      type:       PropTypes.number.isRequired,
      media:      PropTypes.object,
      videoUrl:   PropTypes.string,
      audioUrl:   PropTypes.string,
      isHeadline: PropTypes.bool
    }).isRequired,
    isActive:   PropTypes.bool.isRequired,
    isHover:    PropTypes.bool.isRequired,
    isDragging: PropTypes.bool.isRequired,
    onChange:   PropTypes.func.isRequired
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
    const { block, isActive, isHover, isDragging, onChange } = this.props;
    const isEmpty = block.text === '' && !block.media && !block.videoUrl && !block.audioUrl;

    if (isActive) {
      switch (block.type) {
        case 1:
          return <BlockEditorText block={block} onChange={onChange} />;
        case 2:
          return <BlockEditorImage block={block} onChange={onChange} />;
        case 3:
          return <BlockEditorVideo block={block} onChange={onChange} />;
        case 4:
          return <BlockEditorAudio block={block} onChange={onChange} />;
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
      return (
        <div className={classes}>
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
