import React from 'react';
import PropTypes from 'prop-types';
import { video } from 'utils';
import { SoundCloudPlayer } from 'components/players';

export default class BlockAudio extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      media:   PropTypes.object,
      caption: PropTypes.string
    }).isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block } = this.props;

    const trackId = video.extractSoundCloudTrackId(block.audioUrl);

    return (
      <div>
        <SoundCloudPlayer trackId={trackId} />
      </div>
    );
  }
}
