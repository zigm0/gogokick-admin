import React from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
import { video } from 'utils';

export default class BlockVideo extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      videoUrl: PropTypes.string
    }).isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block } = this.props;

    const videoId = video.extractYoutubeId(block.videoUrl);
    const opts = {
      width:      '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
        rel:      0
      }
    };

    return (
      <div>
        <YouTube
          videoId={videoId}
          opts={opts}
        />
      </div>
    );
  }
}
