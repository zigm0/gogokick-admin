import React from 'react';
import PropTypes from 'prop-types';
import { connect, objects, mapDispatchToProps } from 'utils';
import { Button, ImageUpload } from 'components';
import Menu from './Menu';
import { editorActions, mediaActions } from 'actions';

const mapStateToProps = state => ({
  isUploading: state.media.isUploading
});

@connect(
  mapStateToProps,
  mapDispatchToProps(mediaActions, editorActions)
)
export default class BlockEditorImage extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text:         PropTypes.string,
      type:         PropTypes.number.isRequired,
      origFilename: PropTypes.string
    }).isRequired,
    isUploading:  PropTypes.bool.isRequired,
    mediaUpload:  PropTypes.func.isRequired,
    editorChange: PropTypes.func.isRequired,
    onChange:     PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.state = {
      caption: props.block.caption
    };
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { block, onChange } = this.props;
    const { block: lastBlock } = prevProps;

    if ((!lastBlock.media && !block.media) || (!lastBlock.media && block.media.id) || (block.media.id !== lastBlock.media.id)) {
      onChange(null, null);
    }
  }

  /**
   *
   */
  componentWillUnmount() {
    const { block, editorChange } = this.props;
    const { caption } = this.state;

    editorChange(objects.merge(block, { caption }));
  }

  /**
   * @param {File} file
   */
  handleDrop = (file) => {
    const { block, mediaUpload } = this.props;

    mediaUpload({
      file,
      block:  block.id,
      system: 'block_images'
    });
  };

  /**
   * @param {Event} e
   */
  handleCaptionChange = (e) => {
    this.setState({ caption: e.target.value });
  };

  /**
   * @returns {*}
   */
  render() {
    const { block, isUploading } = this.props;
    const { caption } = this.state;

    let buttons = '';
    if (block.media) {
      buttons = (
        <div className="block-menu-title">
          {block.media.origFilename || ''}
        </div>
      );
    }

    return (
      <>
        <Menu block={block} buttons={buttons} />
        <div className="block-editor block-editor-image">
          <ImageUpload
            media={block.media}
            onDrop={this.handleDrop}
            isUploading={isUploading}
          />
          <div className="block-editor-image-caption">
            <input
              className="text-center"
              placeholder="Caption"
              value={caption}
              onChange={this.handleCaptionChange}
            />
          </div>
        </div>
      </>
    );
  }
}
