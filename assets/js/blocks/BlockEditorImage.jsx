import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Button, ImageUpload } from 'components';
import * as mediaActions from 'actions/mediaActions';
import * as editorActions from 'actions/editorActions';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps(mediaActions, editorActions)
)
export default class BlockEditorImage extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text: PropTypes.string,
      type: PropTypes.number.isRequired
    }).isRequired,
    mediaUpload:  PropTypes.func.isRequired,
    editorChange: PropTypes.func.isRequired,
    onRemove:     PropTypes.func.isRequired
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
   *
   */
  componentWillUnmount() {
    const { block, editorChange } = this.props;
    const { caption } = this.state;

    editorChange({
      blockID: block.id,
      caption
    });
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
    const { block, onRemove } = this.props;
    const { caption } = this.state;

    return (
      <>
        <div className="block-menu block-menu-image">
          <Button
            icon="times"
            className="block-menu-item block-menu-item-remove"
            onClick={e => onRemove(e, block)}
          />
        </div>
        <div className="block-editor block-editor-image">
          <ImageUpload media={block.media} onDrop={this.handleDrop} />
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
