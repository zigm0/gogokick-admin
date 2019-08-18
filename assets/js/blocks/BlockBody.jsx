import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { constants } from 'utils';
import BlockEditorText from './BlockEditorText';
import BlockEditorImage from './BlockEditorImage';
import BlockEditorVideo from './BlockEditorVideo';
import BlockText from './BlockText';
import BlockImage from './BlockImage';
import BlockVideo from './BlockVideo';

export default class BlockBody extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text: PropTypes.string,
      type: PropTypes.number.isRequired
    }).isRequired,
    isActive:   PropTypes.bool.isRequired,
    isHover:    PropTypes.bool.isRequired,
    isDragging: PropTypes.bool.isRequired
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  /**
   * @returns {*}
   */
  render() {
    const { block, isActive, isHover, isDragging } = this.props;
    const isEmpty = block.text === '' && !block.media;

    if (isActive) {
      switch (block.type) {
        case 1:
          return <BlockEditorText block={block} />;
        case 2:
          return <BlockEditorImage block={block} />;
        case 3:
          return <BlockEditorVideo block={block} />;
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
      'block-text-headline': block.type === 1 && block.text.indexOf('<h3>') !== -1
    });

    if (isEmpty) {
      return (
        <div className={classes}>
          <h2 className="block-description">
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
          3: <BlockVideo block={block} />
        }[block.type]}
      </div>
    );
  }
}
