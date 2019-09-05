import React from 'react';
import PropTypes from 'prop-types';
import { styles, constants } from 'utils';
import BlockDescription from './BlockDescription';

export default class BlockVideoEmpty extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      description: PropTypes.string,
      aspectRatio: PropTypes.string
    }).isRequired,
    campaignType: PropTypes.number
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block, campaignType } = this.props;
    const { aspectRatio } = block;

    const height = styles.heights.blocks[campaignType][constants.blockType('video')];

    return (
      <div className="block block-video block-empty">
        <div className="block-empty-dims">
          {block.aspectRatio}
        </div>
        <div className={`block-video-shadow block-video-shadow-${aspectRatio.replace(':', '-')}`} />
        <BlockDescription block={block} icon="video" height={height} />
      </div>
    );
  }
}
