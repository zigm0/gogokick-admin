import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';

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
    const { block } = this.props;

    const blockStyles = {};

    return (
      <div className="block block-audio block-empty" style={blockStyles}>
        <h2 className="block-description">
          <Icon name="music" />
          {block.description || 'Description'}
        </h2>
      </div>
    );
  }
}
