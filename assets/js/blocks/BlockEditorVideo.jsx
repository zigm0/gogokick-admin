import React from 'react';
import PropTypes from 'prop-types';
import { connect, video, mapDispatchToProps, objects } from 'utils';
import { Icon } from 'components';
import Menu from './Menu';
import * as editorActions from 'actions/editorActions';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class BlockEditorVideo extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      videoUrl: PropTypes.string
    }).isRequired,
    onChange:     PropTypes.func.isRequired,
    editorChange: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.input = React.createRef();

    let backgroundImage = '';
    if (props.block.videoUrl) {
      const youtubeId = video.extractYoutubeId(props.block.videoUrl);
      if (youtubeId) {
        backgroundImage = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
      }
    }

    this.state = {
      videoUrl: props.block.videoUrl,
      backgroundImage
    };
  }

  /**
   *
   */
  componentDidMount = () => {
    this.input.current.focus();
  };

  /**
   *
   */
  componentWillUnmount() {
    const { block, editorChange } = this.props;
    const { videoUrl } = this.state;

    editorChange(objects.merge(block, { videoUrl }));
  }

  /**
   * @param {Event} e
   */
  handleChange = (e) => {
    const { value } = e.target;

    const youtubeId = video.extractYoutubeId(value);
    if (youtubeId) {
      this.setState({
        videoUrl:        value,
        backgroundImage: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      });
    } else {
      this.setState({ videoUrl: value });
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { block } = this.props;
    const { videoUrl, backgroundImage } = this.state;

    let buttons = '';
    if (videoUrl) {
      buttons = (
        <div className="block-menu-title">
          {video.youtubeShortUrl(videoUrl)}
        </div>
      );
    }

    const styles = {
      backgroundImage: `url(${backgroundImage})`
    };

    return (
      <>
        <Menu block={block} buttons={buttons} />
        <div className="block-editor block-editor-video" style={styles}>
          <div className="block-editor-video-mask" />
          <div className="block-editor-video-contents">
            <div>
              <Icon name="youtube" fab />
              <Icon name="vimeo" fab />
            </div>
            <input
              ref={this.input}
              name="videoUrl"
              id="input-block-editor-video-url"
              value={videoUrl}
              className="form-control"
              placeholder="https://www.youtube.com/..."
              onChange={this.handleChange}
            />
          </div>
        </div>
      </>
    );
  }
}
