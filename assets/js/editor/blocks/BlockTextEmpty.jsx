import React from 'react';
import PropTypes from 'prop-types';
import { styles, constants } from 'utils';
import BlockDescription from './BlockDescription';

export default class BlockTextEmpty extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      description: PropTypes.string,
      wordCount:   PropTypes.number
    }).isRequired,
    campaignType: PropTypes.number
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block, campaignType } = this.props;

    const blockStyles = {
      height: block.wordCount
        ? (14 * (block.wordCount / 13))
        : styles.heights.blocks[campaignType][constants.blockType('text')]
    };

    return (
      <div ref={this.wrapper} className="block block-text block-empty" style={blockStyles}>
        <div className="block-empty-dims">
          EWC: {block.wordCount || 'N/A'}
        </div>
        <BlockDescription block={block} icon="align-center" height={blockStyles.height} />
      </div>
    );
  }
}
