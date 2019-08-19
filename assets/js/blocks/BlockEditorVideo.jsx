import React from 'react';
import PropTypes from 'prop-types';
import { connect, video, mapDispatchToProps, objects } from 'utils';
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
        backgroundImage = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
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

    const styles = {
      backgroundImage: `url(${backgroundImage})`
    };

    return (
      <>
        <Menu block={block} />
        <div className="block-editor block-editor-video" style={styles}>
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
      </>
    );
  }
}
