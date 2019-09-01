import React from 'react';
import PropTypes from 'prop-types';
import { api } from 'utils';

export default class SoundCloudPlayer extends React.PureComponent {
  static propTypes = {
    audioUrl: PropTypes.string
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      src: ''
    }
  }

  /**
   *
   */
  componentDidMount() {
    const { audioUrl } = this.props;

    if (audioUrl) {
      api.get('https://soundcloud.com/oembed?format=json&url=' + encodeURIComponent(audioUrl))
        .then((resp) => {
          const matches = resp.html.match(/src="([^"]+)"/);
          if (matches.length === 2) {
            this.setState({ src: matches[1] });
          }
        });
    }
  }

  /**
   * @returns {*}
   */
  render() {
    const { src } = this.state;

    return (
      <iframe
        width="100%"
        height="300"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={src}
      />
    );
  }
}
