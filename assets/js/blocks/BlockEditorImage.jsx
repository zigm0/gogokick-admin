import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { ImageUpload } from 'components';
import * as mediaActions from 'actions/mediaActions';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps(mediaActions)
)
export default class BlockEditorImage extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text: PropTypes.string,
      type: PropTypes.number.isRequired
    }).isRequired,
    mediaUpload: PropTypes.func.isRequired
  };

  static defaultProps = {};

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
   * @returns {*}
   */
  render() {
    const { block } = this.props;

    return (
      <div className="block-editor block-editor-image block-expanded">
        <ImageUpload media={block.image} onDrop={this.handleDrop} />
      </div>
    );
  }
}
