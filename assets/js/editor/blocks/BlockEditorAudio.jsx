import React from 'react';
import PropTypes from 'prop-types';
import { connect, video, mapDispatchToProps, objects } from 'utils';
import { Icon } from 'components';
import BlockMenu from './BlockMenu';
import { editorActions } from 'actions';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class BlockEditorAudio extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      audioUrl: PropTypes.string
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
    this.state = {
      audioUrl:        props.block.audioUrl,
      backgroundImage: ''
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
    const { audioUrl } = this.state;

    editorChange(objects.merge(block, { audioUrl }));
  }

  /**
   * @param {Event} e
   */
  handleChange = (e) => {
    const { value } = e.target;

    this.setState({ audioUrl: value });
    const trackId = video.extractSoundCloudTrackId(value);
    if (trackId) {
      this.setState({
        backgroundImage: `https://i1.sndcdn.com/artworks-${trackId}-movvch-t500x500.jpg`
      });
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { block } = this.props;
    const { audioUrl, backgroundImage } = this.state;

    let buttons = '';
    if (audioUrl) {
      buttons = (
        <div className="block-menu-title">
          {audioUrl}
        </div>
      );
    }

    const styles = {
      backgroundImage: `url(https://www.youredm.com/wp-content/uploads/2015/08/soundcloud-ad.png)`
    };

    return (
      <>
        <BlockMenu block={block} buttons={buttons} />
        <div className="block-editor block-editor-audio" style={styles}>
          <div className="block-editor-audio-mask" />
          <div className="block-editor-audio-contents">
            <div>
              <Icon name="soundcloud" fab />
            </div>
            <input
              ref={this.input}
              name="audioUrl"
              id="input-block-editor-audio-url"
              value={audioUrl}
              className="form-control"
              placeholder="https://soundcloud.com/..."
              onChange={this.handleChange}
            />
          </div>
        </div>
      </>
    );
  }
}
