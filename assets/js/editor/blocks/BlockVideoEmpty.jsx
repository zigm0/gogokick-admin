import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';

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
    const { block } = this.props;

    const blockStyles = {};

    return (
      <div className="block block-video block-empty" style={blockStyles}>
        <div className="block-empty-dims">
          {block.aspectRatio}
        </div>
        <h2 className="block-description">
          <Icon name="video" />
          {block.description || 'Description'}
        </h2>
      </div>
    );
  }
}
