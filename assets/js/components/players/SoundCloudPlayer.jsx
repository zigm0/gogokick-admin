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
      src:   '',
      error: null
    }
  }

  /**
   *
   */
  componentDidMount() {
    const { audioUrl } = this.props;

    if (audioUrl) {
      this.handleUpdate();
    }
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { audioUrl } = this.props;
    const { audioUrl: prevAudioUrl } = prevProps;

    if (audioUrl && audioUrl !== prevAudioUrl) {
      this.handleUpdate();
    }
  }

  /**
   *
   */
  handleUpdate = () => {
    const { audioUrl } = this.props;

    api.get('https://soundcloud.com/oembed?format=json&url=' + encodeURIComponent(audioUrl))
      .then((resp) => {
        const matches = resp.html.match(/src="([^"]+)"/);
        if (matches.length === 2) {
          this.setState({
            src:   matches[1],
            error: null
          });
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error, src: '' });
      });
  };

  /**
   * @returns {*}
   */
  render() {
    const { src, error } = this.state;

    if (error) {
      return (
        <div className="block-audio-error block-empty block-audio">
          <div>{error.toString()}</div>
        </div>
      );
    }

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
