import React from 'react';
import PropTypes from 'prop-types';
import { connect, objects, mapDispatchToProps } from 'utils';
import { Upload } from 'components';
import BlockMenu from './BlockMenu';
import { editorActions, mediaActions } from 'actions';

@connect(
  null,
  mapDispatchToProps(mediaActions, editorActions)
)
export default class BlockEditorImage extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      id:           PropTypes.number,
      text:         PropTypes.string,
      media:        PropTypes.object,
      type:         PropTypes.number.isRequired,
      caption:      PropTypes.string,
      origFilename: PropTypes.string
    }).isRequired,
    height:            PropTypes.number.isRequired,
    mediaUpload:       PropTypes.func.isRequired,
    editorUpdateBlock: PropTypes.func.isRequired,
    onChange:          PropTypes.func.isRequired
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
    const { block, editorUpdateBlock } = this.props;
    const { caption } = this.state;

    editorUpdateBlock(objects.merge(block, { caption }));
  }

  /**
   * @param {Event} e
   * @param {File} file
   */
  handleDrop = (e, file) => {
    const { block, mediaUpload } = this.props;

    e.preventDefault();

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
    const { block, height } = this.props;
    const { caption } = this.state;

    let buttons = '';
    if (block.media) {
      buttons = (
        <div className="block-menu-title">
          {block.media.origFilename || ''}
        </div>
      );
    }

    const styles = {};
    if (!block.media) {
      styles.height = height;
    }

    return (
      <>
        <BlockMenu block={block} buttons={buttons} />
        <div className="block-editor block-editor-image" style={styles}>
          <Upload maxSizeMB={50} accept="image/*" system="block_images" onDrop={this.handleDrop}>
            <figure>
              {block.media && (
                <img className="upload-container-img" src={block.media.url} alt="" />
              )}
            </figure>
          </Upload>
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
