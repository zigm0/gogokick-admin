import React from 'react';
import PropTypes from 'prop-types';
import { styles, constants } from 'utils';
import { Icon } from 'components';

export default class BlockImageEmpty extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      description: PropTypes.string,
      height:      PropTypes.number
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
      height: block.height || styles.heights.blocks[campaignType][constants.blockType('image')]
    };

    return (
      <div className="block block-image block-empty" style={blockStyles}>
        <div className="block-empty-dims">
          680x{blockStyles.height}
        </div>
        <h2 className="block-description">
          <Icon name="image" />
          {block.description || 'Description'}
        </h2>
      </div>
    );
  }
}
