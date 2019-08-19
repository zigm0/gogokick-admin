import React from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-cropper';
import { connect, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { Modal } from 'components';
import * as mediaActions from 'actions/mediaActions';

const mapStateToProps = state => ({
  media:      state.editor.modalMeta,
  onComplete: state.editor.modalCallback
});

@connect(
  mapStateToProps,
  mapDispatchToProps(mediaActions)
)
export default class CropperModal extends React.PureComponent {
  static propTypes = {
    media:        PropTypes.object,
    onComplete:   PropTypes.func.isRequired,
    mediaReplace: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.cropper = React.createRef();
  }

  /**
   *
   */
  handleCropClick = () => {
    const { media, mediaReplace, onComplete } = this.props;

    const dataUrl = this.cropper.current.getCroppedCanvas().toDataURL();
    mediaReplace({
      media,
      dataUrl,
      onComplete
    });
  };

  /**
   * @returns {*}
   */
  render() {
    const { media } = this.props;

    if (!media) {
      return null;
    }

    const buttons = (
      <Button theme="success" onClick={this.handleCropClick} sm>
        Crop
      </Button>
    );

    return (
      <Modal
        name="cropper"
        title="Crop Image"
        icon="crop"
        buttons={buttons}
        lg
      >
        <Cropper
          src={media.url}
          ref={this.cropper}
          style={{ height: 500, width: '100%' }}
          aspectRatio={1024 / 576}
          guides={false}
          viewMode={1}
          minContainerWidth={765}
          minContainerHeight={500}
        />
      </Modal>
    );
  }
}
