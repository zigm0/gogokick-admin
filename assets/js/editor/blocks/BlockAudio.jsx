import React from 'react';
import PropTypes from 'prop-types';
import { SoundCloudPlayer } from 'components/players';

export default class BlockAudio extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      audioUrl: PropTypes.string
    }).isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block } = this.props;

    return (
      <SoundCloudPlayer audioUrl={block.audioUrl} />
    );
  }
}
