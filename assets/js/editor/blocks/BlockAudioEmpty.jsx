import React from 'react';
import PropTypes from 'prop-types';
import { styles, constants } from 'utils';
import BlockDescription from './BlockDescription';

export default class BlockAudioEmpty extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      description: PropTypes.string
    }).isRequired,
    campaignType: PropTypes.number
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block, campaignType } = this.props;

    const height = styles.heights.blocks[campaignType][constants.blockType('audio')];

    return (
      <div className="block block-audio block-empty">
        <BlockDescription block={block} icon="music" height={height} />
      </div>
    );
  }
}
