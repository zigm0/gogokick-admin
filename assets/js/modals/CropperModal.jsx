import React from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-cropper';
import { connect, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { Modal } from 'components';
import { mediaActions } from 'actions';

const mapStateToProps = state => ({
  settings:   state.ui.modalMeta.cropper,
  onComplete: state.ui.modalCallbacks.cropper
});

@connect(
  mapStateToProps,
  mapDispatchToProps(mediaActions)
)
export default class CropperModal extends React.PureComponent {
  static propTypes = {
    settings:     PropTypes.object,
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
    const { settings, mediaReplace, onComplete } = this.props;
    const { media } = settings;

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
    const { settings } = this.props;

    if (!settings || !settings.media) {
      return null;
    }

    const { media, width, height } = settings;

    const buttons = (
      <Button theme="success" onClick={this.handleCropClick}>
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
          aspectRatio={(width || 1024) / (height || 576)}
          guides={false}
          background={false}
          viewMode={1}
          minContainerWidth={765}
          minContainerHeight={500}
        />
      </Modal>
    );
  }
}
